"use client";

import { useState, useRef, useCallback } from "react";

interface UseVoiceReturn {
    isRecording: boolean;
    isProcessing: boolean;
    isPlaying: boolean;
    pendingAudio: string | null;
    recordingDuration: number;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    speak: (text: string) => Promise<void>;
    stopAudio: () => void;
    playPendingAudio: () => void;
}

export function useVoice(
    onTranscription?: (text: string) => void
): UseVoiceReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [pendingAudio, setPendingAudio] = useState<string | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const recordingStartTimeRef = useRef<number>(0);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        try {
            // Check if mediaDevices is available (requires secure context on mobile)
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert(
                    "Voice mode requires HTTPS or localhost. Please access the site securely or use text input instead."
                );
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm",
            });

            audioChunksRef.current = [];

            // Set up silence detection using Web Audio API
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);

            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.8;
            microphone.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            // Silence detection
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            let silenceStart = Date.now();
            const SILENCE_THRESHOLD = 15; // Volume threshold (increased for better detection)
            const SILENCE_DURATION = 2000; // 2 seconds of silence
            let isCheckingRef = true; // Use a local variable instead of state

            const checkForSilence = () => {
                if (!isCheckingRef) return;
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") {
                    isCheckingRef = false;
                    return;
                }

                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;

                console.log("Audio level:", average); // Debug logging

                if (average < SILENCE_THRESHOLD) {
                    if (Date.now() - silenceStart > SILENCE_DURATION) {
                        // Auto-stop on silence
                        console.log("Auto-stopping due to silence");
                        isCheckingRef = false;
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                            mediaRecorderRef.current.stop();
                            setIsRecording(false);
                        }
                        return;
                    }
                } else {
                    silenceStart = Date.now();
                }

                silenceTimeoutRef.current = setTimeout(checkForSilence, 100);
            };

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                isCheckingRef = false; // Stop silence detection
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/webm",
                });

                // Stop all tracks to release microphone
                stream.getTracks().forEach((track) => track.stop());

                // Clean up audio context
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                }

                // Clear silence detection
                if (silenceTimeoutRef.current) {
                    clearTimeout(silenceTimeoutRef.current);
                    silenceTimeoutRef.current = null;
                }

                // Clear duration interval
                if (durationIntervalRef.current) {
                    clearInterval(durationIntervalRef.current);
                    durationIntervalRef.current = null;
                }

                setRecordingDuration(0);

                // Send to transcription
                await transcribeAudio(audioBlob);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);

            // Start recording duration timer
            recordingStartTimeRef.current = Date.now();
            durationIntervalRef.current = setInterval(() => {
                setRecordingDuration(Math.floor((Date.now() - recordingStartTimeRef.current) / 1000));
            }, 1000);

            // Start silence detection after 1 second to avoid immediate cut-off
            setTimeout(() => {
                checkForSilence();
            }, 1000);
        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Could not access microphone. Please check permissions.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const transcribeAudio = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.webm");

            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Transcription failed");
            }

            const data = await response.json();
            const transcribedText = data.text;

            if (onTranscription && transcribedText) {
                onTranscription(transcribedText);
            }
        } catch (error) {
            console.error("Error transcribing audio:", error);
            alert("Failed to transcribe audio. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const speak = useCallback(async (text: string) => {
        if (!text.trim()) return;

        try {
            const response = await fetch("/api/speak", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error("TTS failed");
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Try auto-play
            const audio = new Audio(audioUrl);

            // Clean up previous audio if any
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
            }

            currentAudioRef.current = audio;

            audio.onplay = () => {
                setIsPlaying(true);
                setPendingAudio(null);
            };

            audio.onended = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
                currentAudioRef.current = null;
            };

            audio.onerror = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
                currentAudioRef.current = null;
            };

            try {
                await audio.play();
            } catch (error) {
                // Auto-play blocked - save for manual play
                console.log("Auto-play blocked, waiting for user interaction");
                setPendingAudio(audioUrl);
                setIsPlaying(false);
            }
        } catch (error) {
            console.error("Error in TTS:", error);
        }
    }, []);

    const playPendingAudio = useCallback(() => {
        if (pendingAudio) {
            const audio = new Audio(pendingAudio);

            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
            }

            currentAudioRef.current = audio;

            audio.onplay = () => {
                setIsPlaying(true);
                setPendingAudio(null);
            };

            audio.onended = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(pendingAudio);
                currentAudioRef.current = null;
            };

            audio.onerror = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(pendingAudio);
                currentAudioRef.current = null;
            };

            audio.play().catch(console.error);
        }
    }, [pendingAudio]);

    const stopAudio = useCallback(() => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            const url = currentAudioRef.current.src;
            currentAudioRef.current = null;
            setIsPlaying(false);
            if (url) {
                URL.revokeObjectURL(url);
            }
        }
        setPendingAudio(null);
    }, []);

    return {
        isRecording,
        isProcessing,
        isPlaying,
        pendingAudio,
        recordingDuration,
        startRecording,
        stopRecording,
        speak,
        stopAudio,
        playPendingAudio,
    };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, User, Loader2, AlertCircle, Sparkles, X, Mic, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "@/hooks/use-voice";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string>("");
  const [isVoiceInitiated, setIsVoiceInitiated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const speakTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Voice mode hook
  const {
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
  } = useVoice((transcribedText) => {
    // When transcription completes, populate input and auto-submit
    setInput(transcribedText);
    setIsVoiceInitiated(true); // Mark this as voice-initiated
    setTimeout(() => {
      // Trigger form submission
      const event = new Event('submit', { bubbles: true, cancelable: true });
      document.querySelector('form')?.dispatchEvent(event);
    }, 100);
  });

  useEffect(() => {
    if (messages.length > 0) {
      setIsExpanded(true);
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      inputRef.current?.focus();
    }
  }, [isLoading, messages.length]);

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Clear previous assistant message and cancel any pending speak timeouts
    setLastAssistantMessage("");
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    setIsExpanded(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage.content += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...assistantMessage };
          return newMessages;
        });
      }

      // After streaming completes, save and speak the response
      setLastAssistantMessage(assistantMessage.content);
    } catch (err) {
      console.error("Chat Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to speak assistant message after it's set (only for voice-initiated messages)
  useEffect(() => {
    // Clear any existing timeout
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }

    if (lastAssistantMessage && !isLoading && isVoiceInitiated) {
      speakTimeoutRef.current = setTimeout(() => {
        speak(lastAssistantMessage);
        setIsVoiceInitiated(false); // Reset flag after speaking
        speakTimeoutRef.current = null;
      }, 500);
    } else if (lastAssistantMessage && !isLoading && !isVoiceInitiated) {
      // Text message - don't speak, just reset
      setIsVoiceInitiated(false);
    }

    return () => {
      // Cleanup timeout on unmount
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
    };
  }, [lastAssistantMessage, isLoading, isVoiceInitiated, speak]);

  // Handle mobile viewport height for keyboard
  const [viewportStyle, setViewportStyle] = useState({ height: "100dvh", top: "0px" });

  useEffect(() => {
    // Only run on client and if visualViewport is supported
    if (typeof window === "undefined" || !window.visualViewport) return;

    const handleResize = () => {
      // Use visualViewport height if available
      if (window.visualViewport) {
        setViewportStyle({
          height: `${window.visualViewport.height}px`,
          top: `${window.visualViewport.offsetTop}px`,
        });
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);
    handleResize(); // Initial set

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  return (
    <div
      style={
        isExpanded && typeof window !== "undefined" && window.innerWidth < 768
          ? viewportStyle
          : undefined
      }
      className={cn(
        "flex flex-col w-full max-w-3xl mx-auto transition-all duration-500 ease-in-out md:rounded-3xl",
        isExpanded
          ? "fixed inset-x-0 top-0 z-50 bg-[#0a0a0a] md:relative md:inset-auto md:h-[60vh] md:border md:border-white/10 md:shadow-2xl md:overflow-hidden"
          : "relative bg-transparent h-[80px]"
      )}
    >
      {/* Subtle top glow - only visible when expanded */}
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 transition-opacity duration-500",
          isExpanded ? "opacity-50" : "opacity-0"
        )}
      />
      {/* EXPANDED HEADER */}
      <div
        className={cn(
          "flex-none p-4 border-b border-white/10 bg-white/5 flex items-center gap-3 transition-opacity duration-300 md:rounded-t-3xl",
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none hidden"
        )}
      >
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <Bot className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">Fran&apos;s AI assistant</h3>
          <p className="text-xs text-gray-400">Ask me about Fran&apos;s experience</p>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div
        ref={messagesContainerRef}
        className={cn(
          "flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar transition-opacity duration-500",
          isExpanded ? "opacity-100" : "opacity-0 hidden"
        )}
      >
        {messages.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Hey! Want to know more about Fran?</h2>
              <p className="text-gray-400 max-w-sm mx-auto">
                Ask me about his experience, projects, or skills. Type below or tap the mic to chat with your voice.
              </p>
              <p className="text-xs text-blue-400/70 pt-2">
                💡 Voice questions get voice answers
              </p>
            </div>
          </div>
        )}

        {/* Stop Audio Button - Shows when playing */}
        {isPlaying && (
          <div className="flex justify-center pb-4">
            <button
              onClick={stopAudio}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-full text-red-400 text-sm transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>Stop Audio</span>
            </button>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role !== "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${m.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white/5 text-gray-100 border border-white/10 rounded-bl-sm"
                }`}
            >
              <span className="whitespace-pre-wrap">{m.content}</span>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-4 justify-start animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center p-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div
        className={cn(
          "flex-none p-2 transition-all duration-500 ease-in-out z-20 relative",
          isExpanded ? "bg-black/60 border-t border-white/10 backdrop-blur-md md:rounded-b-3xl" : "bg-transparent"
        )}
      >
        {/* Recording Feedback Overlay */}
        {isRecording && (
          <div className="absolute inset-x-0 top-[-60px] flex items-center justify-center">
            <div className="bg-red-600/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-red-500/20 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-white font-medium">Listening...</span>
              </div>
              <div className="h-4 w-px bg-white/30" />
              <span className="text-white/90 text-sm">{recordingDuration}s</span>
              <div className="h-4 w-px bg-white/ 30" />
              <span className="text-white/70 text-xs">Click mic to stop</span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleLocalSubmit}
          className={cn(
            "relative mx-auto flex gap-2 transition-all duration-500",
            isExpanded ? "max-w-4xl" : "max-w-2xl"
          )}
        >
          <div className={cn(
            "flex-1 flex items-center gap-3 bg-white/5 border border-white/10 text-white rounded-2xl pl-4 pr-2 py-3 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all shadow-lg",
            !isExpanded && "bg-white/5 border-blue-500/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] hover:border-blue-500/50 hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.3)] cursor-text p-4"
          )}
            onClick={() => {
              setIsExpanded(true);
              inputRef.current?.focus();
            }}
          >
            {!isExpanded && (
              <div className="p-1.5 bg-blue-500/20 rounded-lg animate-pulse">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
            )}
            <input
              ref={inputRef}
              className="flex-1 bg-transparent border-none focus:outline-none placeholder-gray-400 text-sm h-10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder={isExpanded ? "Ask something about Fran..." : "Ask about my Growth Strategy, AI Builds, or Leadership Experience..."}
              autoComplete="off"
              disabled={isLoading || isProcessing}
            />

            {/* Voice Mode Button */}
            {isExpanded && (
              <button
                type="button"
                onClick={() => {
                  if (isRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
                disabled={isLoading || isProcessing}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  isRecording
                    ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                    : "bg-white/10 hover:bg-white/20 text-gray-400 disabled:opacity-50"
                )}
              >
                <Mic className="w-5 h-5" />
              </button>
            )}

            {/* Pending Audio Play Button */}
            {pendingAudio && (
              <button
                type="button"
                onClick={playPendingAudio}
                className="w-10 h-10 bg-green-600 hover:bg-green-500 text-white rounded-xl flex items-center justify-center transition-all animate-pulse"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !input.trim() || isProcessing}
              className={cn(
                "w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed",
                !isExpanded && "bg-transparent hover:bg-white/10 text-blue-400 shadow-none"
              )}
            >
              {isLoading || isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className={cn("w-6 h-6 transition-transform", !isExpanded && "scale-110")} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
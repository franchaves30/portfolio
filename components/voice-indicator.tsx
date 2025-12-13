"use client";

import { cn } from "@/lib/utils";

interface VoiceIndicatorProps {
    isSpeaking: boolean;
    isConnected: boolean;
    className?: string;
}

export function VoiceIndicator({ isSpeaking, isConnected, className }: VoiceIndicatorProps) {
    if (!isConnected) return null;

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {isSpeaking ? (
                // Sound Wave Animation
                <>
                    <div className="w-1 bg-blue-400 rounded-full h-3 animate-[pulse_0.5s_ease-in-out_infinite]" />
                    <div className="w-1 bg-blue-400 rounded-full h-5 animate-[pulse_0.5s_ease-in-out_infinite_0.1s]" />
                    <div className="w-1 bg-blue-400 rounded-full h-3 animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                </>
            ) : (
                // Listening State
                <div className="flex items-center gap-2 px-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-xs text-blue-400 font-medium">Listening...</span>
                </div>
            )}
        </div>
    );
}

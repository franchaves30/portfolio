"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

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
    } catch (err) {
      console.error("Chat Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl h-[calc(100dvh-200px)] md:h-[70vh] min-h-[400px] max-h-[800px] relative">

      {/* HEADER */}
      <div className="flex-none p-4 border-b border-white/10 bg-white/5 flex items-center gap-3 z-10">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Bot className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Portfolio Assistant</h3>
          <p className="text-xs text-gray-400">Ask me anything about Fran&apos;s experience</p>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Hello! I&apos;m Fran&apos;s AI Assistant.</h2>
              <p className="text-gray-400 max-w-sm mx-auto">
                I can tell you about his experience, skills, and projects. What would you like to know?
              </p>
            </div>
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
              className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${m.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white/5 text-gray-100 border border-white/10 rounded-bl-sm"
                }`}
            >
              <span className="whitespace-pre-wrap">{m.content}</span>
            </div>

            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-purple-400" />
              </div>
            )}
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
      <div className="flex-none p-4 bg-black/60 border-t border-white/10 backdrop-blur-md z-20">
        <form onSubmit={handleLocalSubmit} className="relative max-w-4xl mx-auto flex gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl pl-4 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about Fran..."
            autoComplete="off"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="aspect-square h-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
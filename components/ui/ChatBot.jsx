"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Minimize2,
  Maximize2,
  Brain,
  Sparkles,
  User,
  Trash2,
} from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am Becho AI. How can I assist you today with your surplus materials or sustainability goals?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("becho_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history");
      }
    }
  }, []);

  // Sync to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) {
      // Don't save if it's just the initial greeting
      localStorage.setItem("becho_chat_history", JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const router = useRouter();

  async function handleSend(e) {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-5), // Send last 5 for context
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${data.error}`,
            isError: true,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function renderContent(content) {
    if (!content) return null;

    // Split by lines first to handle lists and paragraphs
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      // Handle Bullet Points
      const isBullet =
        line.trim().startsWith("- ") || line.trim().startsWith("* ");
      const cleanLine = isBullet ? line.trim().substring(2) : line;

      // Split by bold markers and links
      // Combined regex for links [label](url) and bold **text**
      const parts = cleanLine.split(/(\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g);

      const renderedLine = parts.filter(Boolean).map((part, i) => {
        // Match Links
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const label = linkMatch[1];
          const url = linkMatch[2];
          return (
            <button
              key={i}
              onClick={() => router.push(url)}
              className="text-green-600 font-bold underline hover:text-green-700 transition-colors mx-0.5 inline-block text-left"
            >
              {label}
            </button>
          );
        }

        // Match Bold
        const boldMatch = part.match(/\*\*(.*?)\*\*/);
        if (boldMatch) {
          return (
            <strong key={i} className="font-extrabold text-slate-900 mx-0.5">
              {boldMatch[1]}
            </strong>
          );
        }

        return <span key={i}>{part}</span>;
      });

      return (
        <div
          key={lineIdx}
          className={`${isBullet ? "flex gap-2 ml-2 mb-1" : "mb-2"}`}
        >
          {isBullet && <span className="text-green-500 font-bold">•</span>}
          <div className="flex-1 leading-relaxed">{renderedLine}</div>
        </div>
      );
    });
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* ── Chat Window ─────────────────────────────────────── */}
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                <Brain size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Becho AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMessages([
                    {
                      role: "assistant",
                      content: "Chat cleared. How can I help?",
                    },
                  ]);
                  localStorage.removeItem("becho_chat_history");
                }}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-colors"
                title="Clear Chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors"
              >
                <Minimize2 size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-none"
                      : msg.isError
                        ? "bg-red-50 text-red-600 border border-red-100 rounded-tl-none font-medium text-xs"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none leading-relaxed"
                  }`}
                >
                  {msg.role === "assistant" && !msg.isError && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="text-amber-500" size={12} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        AI Insight
                      </span>
                    </div>
                  )}
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Thinking
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about materials, prices, impact..."
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 disabled:opacity-30 transition-all shadow-md active:scale-95"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
            <p className="mt-3 text-[10px] text-center text-slate-400 font-medium tracking-tight">
              ⚡ Powered by Gemini Flash • Becho Sustainability Core
            </p>
          </div>
        </div>
      )}

      {/* ── Toggle Button ──────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 ${
          isOpen
            ? "bg-slate-900 hover:bg-slate-800 rotate-90"
            : "bg-green-600 hover:bg-green-500"
        } group`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <div className="relative">
            <MessageCircle className="text-white" size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-green-600 rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://ai-workflow-backend-5dtn.onrender.com/api/ai/chat", {
        message: input,
      });

      const aiMessage: Message = {
        role: "ai",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
  let errorMsg = "❌ Error getting response";

  if (err instanceof Error) {
    errorMsg = err.message;
  }

  setMessages((prev) => [
    ...prev,
    { role: "ai", content: errorMsg },
  ]);
}

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen p-4 md:p-8">

      {/* 🔥 Header */}
      <div className="glass-card p-4 mb-4">
        <h1 className="text-xl font-bold">🤖 AI Assistant</h1>
      </div>

      {/* 🔥 Chat Area */}
      <div className="flex-1 overflow-y-auto glass-card p-4 space-y-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-purple-600 ml-auto"
                : "bg-white/20"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {/* 🔥 Loading */}
        {loading && (
          <div className="bg-white/20 p-3 rounded-lg w-fit">
            Typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 🔥 Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-3 rounded-lg bg-white/20 outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
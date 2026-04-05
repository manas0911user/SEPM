"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.replace("/login");
    return;
  }

  setTimeout(() => {
    setLoading(false);
  }, 0);
}, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-10 py-6">

      {/* 🔥 NAVBAR */}
      <div className="glass-card p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold">🚀 AI Workflow</h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/ai")}
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            AI
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 HERO */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Welcome back 👋
        </h2>
        <p className="text-gray-300 mt-2 text-sm md:text-base">
          Build, automate and scale workflows using AI
        </p>
      </div>

      {/* 🔥 ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

        <Card
          title="🤖 AI Assistant"
          desc="Ask anything using AI"
          onClick={() => router.push("/ai")}
        />

        <Card
          title="⚡ Create Workflow"
          desc="Build automation flows"
          onClick={() => router.push("/workflow")}
        />

        <Card
          title="📊 Analytics"
          desc="View usage insights"
          onClick={() => alert("Coming soon")}
        />

      </div>

      {/* 🔥 WORKFLOW LIST */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3">
          Your Workflows
        </h2>

        <div className="text-gray-400 text-sm">
          No workflows yet 🚀
        </div>
      </div>

    </div>
  );
}

/* 🔥 REUSABLE CARD */
type CardProps = {
  title: string;
  desc: string;
  onClick: () => void;
};
function Card({ title, desc, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="glass-card p-5 cursor-pointer hover:scale-105 hover:shadow-xl transition duration-300"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-300 mt-2">{desc}</p>
    </div>
  );
}
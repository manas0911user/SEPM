"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const router = useRouter();

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">

      {/* ✅ Sidebar Component */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">

        {/* 🔥 Top Bar */}
        <div className="glass-card p-4 flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* 🔥 Welcome */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-semibold">Welcome back 👋</h2>
          <p className="text-gray-300 mt-2">
            Build and automate workflows using AI
          </p>
        </div>

        {/* 🔥 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card
            title="🤖 AI Assistant"
            desc="Ask anything using AI"
            onClick={() => router.push("/ai")}
          />

          <Card
            title="⚡ Create Workflow"
            desc="Build automation flows"
            onClick={() => alert("Coming soon")}
          />

          <Card
            title="📊 Analytics"
            desc="View usage insights"
            onClick={() => alert("Coming soon")}
          />

        </div>

      </div>
    </div>
  );
}

/* ✅ Proper TypeScript */
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
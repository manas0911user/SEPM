"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const getUser = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email || "User";
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (getUser() === null) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const user = getUser();

  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0b0d14" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, border: "3px solid #6366f1", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ color: "#4a5080", fontSize: 13, fontFamily: "monospace" }}>Loading...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const initials = user.slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#0b0d14", fontFamily: "'Inter', sans-serif", color: "#e2e8f0" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#0d0f1a",
        borderBottom: "1px solid #1e2130",
        padding: "0 28px",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-0.3px" }}>Logichub</span>
          <span style={{ fontSize: 10, background: "#6366f122", color: "#818cf8", border: "1px solid #6366f133", borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>BETA</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { label: "Dashboard", path: "/dashboard", icon: "⊞" },
            { label: "Workflows", path: "/workflow", icon: "⚡" },
            { label: "AI Chat", path: "/ai", icon: "🤖" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                padding: "6px 12px", borderRadius: 8,
                fontSize: 13, color: "#8892b0", fontWeight: 500,
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#1a1d2e";
                (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#8892b0";
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#1a1d2e", border: "1px solid #1e2130",
            borderRadius: 20, padding: "4px 12px 4px 4px",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff",
            }}>{initials}</div>
            <span style={{ fontSize: 12, color: "#8892b0", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "#1a1d2e", border: "1px solid #ef444433",
              borderRadius: 8, padding: "6px 14px", fontSize: 13,
              color: "#ef4444", cursor: "pointer", fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444422"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1d2e"; }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>

        <div style={{
          background: "linear-gradient(135deg, #1a1d2e, #141728)",
          border: "1px solid #1e2130",
          borderRadius: 16, padding: "28px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 28,
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Welcome back, {user} 👋</div>
            <div style={{ fontSize: 14, color: "#4a5080" }}>Build, automate and scale workflows using AI — all in one place.</div>
          </div>
          <button
            onClick={() => router.push("/workflow")}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", borderRadius: 10,
              padding: "10px 20px", fontSize: 13, fontWeight: 600,
              color: "#fff", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            + New Workflow
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total Workflows", value: "0", icon: "⚡", color: "#6366f1" },
            { label: "AI Runs",         value: "0", icon: "🤖", color: "#8b5cf6" },
            { label: "Nodes Created",   value: "0", icon: "◈",  color: "#06b6d4" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#0d0f1a", border: "1px solid #1e2130",
              borderRadius: 12, padding: "20px 22px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${stat.color}22`, border: `1px solid ${stat.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "#4a5080", marginTop: 2 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { icon: "🤖", title: "AI Assistant", desc: "Chat with AI, generate content, analyze data instantly.", color: "#8b5cf6", tag: "Ready", path: "/ai" },
            { icon: "⚡", title: "Workflow Builder", desc: "Drag & drop nodes to build powerful automation flows.", color: "#6366f1", tag: "New", path: "/workflow" },
            { icon: "📊", title: "Analytics", desc: "Track workflow runs, AI usage, and performance metrics.", color: "#06b6d4", tag: "Soon", path: null },
          ].map((card) => (
            <div
              key={card.title}
              onClick={() => card.path ? router.push(card.path) : null}
              style={{
                background: "#0d0f1a", border: "1px solid #1e2130",
                borderRadius: 14, padding: "22px",
                cursor: card.path ? "pointer" : "default",
                transition: "all 0.2s", position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!card.path) return;
                (e.currentTarget as HTMLElement).style.borderColor = `${card.color}66`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#1e2130";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: `${card.color}22`, border: `1px solid ${card.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{card.icon}</div>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                  background: `${card.color}22`, color: card.color, border: `1px solid ${card.color}33`,
                }}>{card.tag}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 6 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: "#4a5080", lineHeight: 1.6 }}>{card.desc}</div>
              {card.path && <div style={{ marginTop: 16, fontSize: 12, color: card.color, fontWeight: 500 }}>Open →</div>}
            </div>
          ))}
        </div>

        <div style={{
          background: "#0d0f1a", border: "1px solid #1e2130",
          borderRadius: 14, padding: "22px 24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Recent Workflows</div>
            <button
              onClick={() => router.push("/workflow")}
              style={{ background: "#6366f122", border: "1px solid #6366f133", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#818cf8", cursor: "pointer" }}
            >
              + Create New
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 0", gap: 10 }}>
            <div style={{ fontSize: 36 }}>⚡</div>
            <div style={{ fontSize: 14, color: "#4a5080" }}>No workflows yet</div>
            <div style={{ fontSize: 12, color: "#2a3060" }}>Click New Workflow to get started</div>
          </div>
        </div>

      </main>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regex.test(value)) return "Enter a valid Gmail address";
    return "";
  };

  const handleSubmit = async () => {
    if (!email || !password) { setError("All fields are required"); return; }
    const err = validateEmail(email);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://ai-workflow-backend-5dtn.onrender.com/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0d14",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "0 16px",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: "-0.3px" }}>Logichub</span>
          <span style={{ fontSize: 10, background: "#6366f122", color: "#818cf8", border: "1px solid #6366f133", borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>BETA</span>
        </div>

        {/* Card */}
        <div style={{
          background: "#0d0f1a",
          border: "1px solid #1e2130",
          borderRadius: 16,
          padding: "32px",
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Welcome back 👋</div>
          <div style={{ fontSize: 13, color: "#4a5080", marginBottom: 28 }}>Sign in to your Logichub account</div>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#8892b0", fontWeight: 500, display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#141728",
                border: "1px solid #1e2130",
                borderRadius: 10,
                color: "#e2e8f0",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#1e2130"; }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: "#8892b0", fontWeight: 500, display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#141728",
                border: "1px solid #1e2130",
                borderRadius: 10,
                color: "#e2e8f0",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#1e2130"; }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#ef444415",
              border: "1px solid #ef444433",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#ef4444",
              marginBottom: 18,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: "2px solid #ffffff55", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Signing in...
              </>
            ) : "Sign In"}
          </button>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 13, color: "#4a5080", marginTop: 24 }}>
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regex.test(value)) {
      return "Enter a valid Gmail address";
    }
    return "";
  };

  const handleSubmit = async () => {
    try {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError("All fields are required");
        return;
      }

      const err = validateEmail(email);
      if (err) {
        setError(err);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          firstName,
          lastName,
          email,
          password,
        }
      );

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect
      router.push("/dashboard");

    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong");
  }
}
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="glass-card p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account 
        </h2>

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setError("");
          }}
          className="w-full p-3 mb-3 rounded-lg bg-white/20"
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setError("");
          }}
          className="w-full p-3 mb-3 rounded-lg bg-white/20"
        />

        <input
          type="email"
          placeholder="Enter Gmail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="w-full p-3 mb-3 rounded-lg bg-white/20"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="w-full p-3 mb-3 rounded-lg bg-white/20"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
          className="w-full p-3 mb-4 rounded-lg bg-white/20"
        />

        {error && (
          <p className="text-red-300 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-white text-purple-600 font-semibold"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-5 text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
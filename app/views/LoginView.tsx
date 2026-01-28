"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  ArrowRight,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

const LoginView: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    // Check for pre-filled credentials from password reset
    const savedCredentials = localStorage.getItem("loginCredentials");
    if (savedCredentials) {
      const { email: savedEmail, password: savedPassword } =
        JSON.parse(savedCredentials);
      setEmail(savedEmail);
      setPassword(savedPassword);
      localStorage.removeItem("loginCredentials"); // Clear after use
    }
  }, []);

  // Apply dark mode class and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store user in localStorage
      const userWithAvatar = {
        ...data.user,
        avatar: data.user.photo, // Map photo to avatar
      };
      localStorage.setItem("user", JSON.stringify(userWithAvatar));

      // Redirect based on user role
      if (data.user.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-1000 relative">
      {/* Theme Toggle for Login Screen */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 md:top-10 md:right-10 z-50 w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-[#c8a47e] bg-white/50 dark:bg-black/20 backdrop-blur-md transition-all hover:scale-110"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#2d2a27] rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 min-h-[600px] transition-colors duration-500">
        {/* Left: Visual */}
        <div className="relative bg-[#e8f3ee] dark:bg-emerald-950/30 p-12 flex flex-col justify-between group overflow-hidden transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-black/20 pointer-events-none" />
          <div className="text-[12rem] absolute -right-16 top-1/2 -translate-y-1/2 opacity-10 md:opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 grayscale dark:opacity-5">
            🌿
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] rounded-xl flex items-center justify-center">
                🌟
              </div>
              <span className="text-xl font-black italic tracking-tighter dark:text-white">
                Oasis
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic text-[#3e3a36] dark:text-white leading-[0.9] mb-6">
              Return to <br /> the{" "}
              <span
                className="text-transparent border-text"
                style={{
                  WebkitTextStroke: darkMode ? "1px #ffffff" : "1px #3e3a36",
                }}
              >
                Sanctuary
              </span>
            </h1>
          </div>
          <p className="relative z-10 text-[#3e3a36]/60 dark:text-white/60 font-medium max-w-xs leading-relaxed">
            Sign in to access your botanical history, curated selections, and
            loyalty rewards.
          </p>
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                  Identity
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50 disabled:opacity-50"
                    placeholder="gardener@oasis.io"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                  Passphrase
                </label>
                <div className="relative group">
                  <KeyRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-12 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c8a47e] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#3e3a36] dark:hover:text-white transition-colors">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#3e3a36] focus:ring-[#c8a47e] bg-gray-50 dark:bg-white/10 dark:border-white/10"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="hover:text-[#c8a47e] transition-colors"
              >
                Lost key?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#2d2a27] dark:hover:bg-gray-200 transition-all hover:gap-6 active:scale-95 group shadow-xl shadow-[#3e3a36]/10 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Entering..." : "Enter Oasis"}{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                New to the garden?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="font-bold text-[#3e3a36] dark:text-white hover:text-[#c8a47e] transition-colors"
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

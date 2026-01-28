"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import RegisterCard from "@/components/ui/RegisterCard";

const RegisterView: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Apply dark mode class and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to login page after successful registration
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-1000 relative">
      {/* Theme Toggle for Register Screen */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 md:top-10 md:right-10 z-50 w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-[#c8a47e] bg-white/50 dark:bg-black/20 backdrop-blur-md transition-all hover:scale-110"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#2d2a27] rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 min-h-[600px] transition-colors duration-500">
        {/* Left: Visual - Adjusted for Register */}
        <div className="relative bg-[#fdf2e9] dark:bg-orange-950/30 p-12 flex flex-col justify-between group overflow-hidden transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-black/20 pointer-events-none" />
          <div className="text-[12rem] absolute -right-16 top-1/2 -translate-y-1/2 opacity-10 md:opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 grayscale dark:opacity-5">
            🌱
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#af601a] dark:bg-white text-white dark:text-[#af601a] rounded-xl flex items-center justify-center">
                <Leaf size={18} />
              </div>
              <span className="text-xl font-black italic tracking-tighter dark:text-white">Oasis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic text-[#3e3a36] dark:text-white leading-[0.9] mb-6">
              Plant your <br /> first <span className="text-transparent border-text" style={{ WebkitTextStroke: darkMode ? "1px #ffffff" : "1px #3e3a36" }}>Seed</span>
            </h1>
          </div>
          <p className="relative z-10 text-[#3e3a36]/60 dark:text-white/60 font-medium max-w-xs leading-relaxed">
            Join our community of mindful gatherers. Cultivate your taste.
          </p>
        </div>

        {/* Right: Form */}
        <div>
          <RegisterCard
            name={name}
            email={email}
            password={password}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            onSubmit={handleRegister}
            error={error}
            isLoading={isLoading}
          />
          
          <div className="text-center px-8 pb-8">
            <p className="text-sm text-gray-400">
              Already cultivated?{' '}
              <button 
                type="button" 
                onClick={() => router.push('/login')} 
                className="font-bold text-[#3e3a36] dark:text-white hover:text-[#c8a47e] transition-colors"
              >
                Return to Sanctuary
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;

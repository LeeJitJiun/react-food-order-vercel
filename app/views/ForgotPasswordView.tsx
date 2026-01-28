"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Mail, KeyRound, Lock, Send, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const getPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: '', color: '', width: '0%' };
  
  let strength = 0;
  if (password.length >= 1) strength++; // Weak for any input
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  const levels = [
    { strength: 0, label: '', color: '', width: '0%' },
    { strength: 1, label: 'Weak', color: 'bg-red-500', width: '20%' },
    { strength: 2, label: 'Fair', color: 'bg-orange-500', width: '40%' },
    { strength: 3, label: 'Good', color: 'bg-yellow-500', width: '60%' },
    { strength: 4, label: 'Strong', color: 'bg-emerald-500', width: '80%' },
    { strength: 5, label: 'Very Strong', color: 'bg-emerald-600', width: '100%' },
    { strength: 6, label: 'Excellent', color: 'bg-emerald-700', width: '100%' },
  ];
  
  return levels[Math.min(strength, 6)];
};

const ForgotPasswordView: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  const passwordStrength = getPasswordStrength(newPassword);

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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setIsLoading(false);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      setIsLoading(false);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setIsLoading(false);
      
      // Store credentials for auto-fill
      localStorage.setItem('loginCredentials', JSON.stringify({ email, password: newPassword }));
      
      // Redirect to login
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-1000 relative">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 md:top-10 md:right-10 z-50 w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-[#c8a47e] bg-white/50 dark:bg-black/20 backdrop-blur-md transition-all hover:scale-110"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#2d2a27] rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 min-h-[600px] transition-colors duration-500">
        {/* Left: Visual */}
        <div className="relative bg-[#ebf5fb] dark:bg-blue-950/30 p-12 flex flex-col justify-between group overflow-hidden transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-black/20 pointer-events-none" />
          <div className="text-[12rem] absolute -right-16 top-1/2 -translate-y-1/2 opacity-10 md:opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 grayscale dark:opacity-5">
            🌫️
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#1b4f72] dark:bg-white text-white dark:text-[#1b4f72] rounded-xl flex items-center justify-center">
                <Lock size={18} />
              </div>
              <span className="text-xl font-black italic tracking-tighter dark:text-white">Oasis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black italic text-[#3e3a36] dark:text-white leading-[0.9] mb-6">
              Recover <br /> your <span className="text-transparent border-text" style={{ WebkitTextStroke: darkMode ? "1px #ffffff" : "1px #3e3a36" }}>Path</span>
            </h1>
          </div>
          <p className="relative z-10 text-[#3e3a36]/60 dark:text-white/60 font-medium max-w-xs leading-relaxed">
            The garden remembers. Use your digital key to restore access to your sanctuary.
          </p>
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Registered Identity</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
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
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#2d2a27] dark:hover:bg-gray-200 transition-all hover:gap-6 active:scale-95 group shadow-xl shadow-[#3e3a36]/10 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching Records...' : 'Send Access Seed'} {!isLoading && <Send size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full text-center font-bold text-gray-400 hover:text-[#3e3a36] dark:hover:text-white transition-colors text-sm"
              >
                Wait, I found my key
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleVerifyOTP} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#ebf5fb] dark:bg-blue-900/20 text-[#1b4f72] dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white">Check your messages</h3>
                  <p className="text-sm text-gray-400 mt-2">We've sent a 6-digit seed code to <span className="font-bold text-[#c8a47e]">{email}</span></p>
                  <p className="text-xs text-[#c8a47e] mt-3 font-bold">Demo OTP: 123456</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Access Seed (OTP)</label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      disabled={isLoading}
                      className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50 tracking-[0.5em] text-center font-mono disabled:opacity-50"
                      placeholder="000000"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#2d2a27] dark:hover:bg-gray-200 transition-all hover:gap-6 active:scale-95 group shadow-xl shadow-[#3e3a36]/10 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'} {!isLoading && <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />}
              </button>

              <button
                type="button"
                onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
                className="w-full text-center font-bold text-gray-400 hover:text-[#3e3a36] dark:hover:text-white transition-colors text-sm"
              >
                Resend Code
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#e8f3ee] dark:bg-emerald-900/20 text-[#2d5a27] dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white">Create New Passphrase</h3>
                  <p className="text-sm text-gray-400 mt-2">Set a new password for your sanctuary access</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">New Passphrase</label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                      className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-12 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50 disabled:opacity-50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c8a47e] transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                      {passwordStrength.label && (
                        <p className="text-xs font-bold text-gray-400">
                          Strength: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Confirm Passphrase</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isLoading}
                      className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-12 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50 disabled:opacity-50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c8a47e] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#2d2a27] dark:hover:bg-gray-200 transition-all hover:gap-6 active:scale-95 group shadow-xl shadow-[#3e3a36]/10 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'} {!isLoading && <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;

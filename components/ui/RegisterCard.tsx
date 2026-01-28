"use client";

import React, { useState } from 'react';
import { Mail, KeyRound, ArrowRight, User, Eye, EyeOff } from 'lucide-react';

interface RegisterCardProps {
  name: string;
  email: string;
  password: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
  isLoading?: boolean;
}

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

const RegisterCard: React.FC<RegisterCardProps> = ({ 
  name, 
  email, 
  password, 
  setName, 
  setEmail, 
  setPassword, 
  onSubmit,
  error,
  isLoading 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = getPasswordStrength(password);
  
  return (
    <div className="p-8 md:p-16 flex flex-col justify-center">
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50"
                placeholder="Your Name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Identity</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50"
                placeholder="gardener@oasis.io"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Passphrase</label>
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c8a47e] transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-12 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50"
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
            {password && (
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
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#2d2a27] dark:hover:bg-gray-200 transition-all hover:gap-6 active:scale-95 group shadow-xl shadow-[#3e3a36]/10 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Joining...' : 'Join Oasis'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default RegisterCard;

"use client";

import React, { useState } from 'react';
import { Mail, KeyRound, ArrowRight } from 'lucide-react';

interface LoginCardProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ email, password, setEmail, setPassword, onSubmit }) => {
  return (
    <div className="p-8 md:p-16 flex flex-col justify-center">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-4">
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
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white font-medium placeholder:text-gray-400/50"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#2d2a27] dark:hover:bg-gray-200 transition-all hover:gap-6 active:scale-95 group shadow-xl shadow-[#3e3a36]/10 dark:shadow-none"
        >
          Enter Oasis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default LoginCard;
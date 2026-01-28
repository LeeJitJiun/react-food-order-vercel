'use client';

import { Mail, Settings, CreditCard, ShieldCheck, Clock, LogOut } from 'lucide-react';
import { ProfileCard } from '../../components/ui/ProfileCard';

interface User {
    userId: string;
    username: string;
    email: string;
    role: string;
    avatar?: string | null;
}

interface ProfileViewProps {
    user: User;
    ordersCount: number;
    onLogout?: () => void;
    onEditProfile?: () => void;
}

export function ProfileView({ user, ordersCount, onLogout, onEditProfile }: ProfileViewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="max-w-4xl">
                <div className="bg-white dark:bg-[#2d2a27] rounded-[3rem] p-12 mb-8 border border-gray-100 dark:border-white/5">
                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-[#fcf3cf] dark:bg-yellow-900/30 flex items-center justify-center overflow-hidden text-5xl">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    '👤'
                                )}
                            </div>
                            <button 
                                onClick={onEditProfile}
                                className="absolute bottom-0 right-0 p-2 bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                                <Settings size={14} />
                            </button>
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <h1 className="text-4xl font-black italic dark:text-white">{user.username}</h1>
                                <span className="px-4 py-1.5 bg-[#c8a47e]/10 text-[#af601a] rounded-full text-xs font-black uppercase tracking-tighter self-center">
                                    {user.role} Tier
                                </span>
                            </div>
                            <p className="text-gray-400 mb-6 flex items-center justify-center md:justify-start gap-2">
                                <Mail size={16} /> {user.email}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Harvests</p>
                                    <p className="text-xl font-black dark:text-white">{ordersCount}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Member Since</p>
                                    <p className="text-xl font-black dark:text-white">2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileCard icon={CreditCard} title="Payments" desc="Manage your botanical cards" />
                    <ProfileCard icon={ShieldCheck} title="Privacy" desc="Your data is encrypted by light" />
                    <ProfileCard icon={Clock} title="Cycles" desc="Subscription & loyalty settings" />
                    <ProfileCard icon={LogOut} title="Leave Oasis" desc="Logout from the garden" destructive onClick={onLogout} />
                </div>
            </div>
        </div>
    );
}

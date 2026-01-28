'use client';

import { LucideIcon } from 'lucide-react';

interface ProfileCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
    destructive?: boolean;
    onClick?: () => void;
}

export function ProfileCard({
    icon: Icon,
    title,
    desc,
    destructive = false,
    onClick
}: ProfileCardProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-6 p-6 bg-white dark:bg-[#2d2a27] rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:shadow-xl transition-all group text-left w-full"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${destructive
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-500'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-[#3e3a36] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#3e3a36]'
                }`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className={`font-bold ${destructive ? 'text-red-500' : 'dark:text-white'}`}>
                    {title}
                </h4>
                <p className="text-xs text-gray-400">{desc}</p>
            </div>
        </button>
    );
}

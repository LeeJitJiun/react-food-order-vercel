import { LucideIcon } from 'lucide-react';

interface NavButtonProps {
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
}

export function NavButton({ icon: Icon, active, onClick }: NavButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active
                    ? 'bg-[#fdf2e9] dark:bg-orange-900/30 text-[#af601a] dark:text-orange-400'
                    : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
        >
            <Icon size={20} />
        </button>
    );
}

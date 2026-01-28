'use client';

import { Plus, Minus } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
    id: string;
    name: string;
    price: number;
    photo: string | null;
    quantity: number;
    category: {
        name: string;
    };
    onUpdateQty: (delta: number) => void;
}

export function CartItem({
    name,
    price,
    photo,
    quantity,
    category,
    onUpdateQty
}: CartItemProps) {
    const getEmoji = () => {
        const emojis: Record<string, string> = {
            'earth': '🍄',
            'fire': '🍔',
            'water': '🦪',
            'air': '☁️',
            'drinks': '🍹',
            'dessert': '🌋',
            'salad': '🥗',
            'pasta': '🍝'
        };
        const key = category.name.toLowerCase();
        return emojis[key] || '🍽️';
    };

    const getCategoryAccent = () => {
        const accents: Record<string, string> = {
            'earth': 'bg-[#e8f3ee] dark:bg-emerald-900/30 text-[#2d5a27] dark:text-emerald-400',
            'fire': 'bg-[#fdeded] dark:bg-red-900/30 text-[#943126] dark:text-red-400',
            'water': 'bg-[#ebf5fb] dark:bg-blue-900/30 text-[#1b4f72] dark:text-blue-400',
            'air': 'bg-[#f4ecf7] dark:bg-purple-900/30 text-[#512e5f] dark:text-purple-400'
        };
        const key = category.name.toLowerCase();
        return accents[key] || 'bg-[#fdf2e9] dark:bg-orange-900/30 text-[#af601a] dark:text-orange-400';
    };

    return (
        <div className="flex gap-6 group">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl flex-shrink-0 ${getCategoryAccent()}`}>
                {photo ? (
                    <Image src={photo} alt={name} width={80} height={80} className="rounded-3xl object-cover" />
                ) : (
                    getEmoji()
                )}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-lg dark:text-white">{name}</h4>
                <p className="text-gray-400 text-xs mb-3 font-medium tracking-wide uppercase">
                    {category.name} element
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 rounded-full px-4 py-2">
                        <button onClick={() => onUpdateQty(-1)} className="dark:text-white">
                            <Minus size={14} />
                        </button>
                        <span className="text-sm font-black w-4 text-center dark:text-white">
                            {quantity}
                        </span>
                        <button onClick={() => onUpdateQty(1)} className="dark:text-white">
                            <Plus size={14} />
                        </button>
                    </div>
                    <span className="font-black dark:text-white">
                        RM{(price * quantity).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}

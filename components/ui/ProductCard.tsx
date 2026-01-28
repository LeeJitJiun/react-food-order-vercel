'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    description: string | null;
    photo: string | null;
    category: {
        name: string;
    };
    onAddToCart: () => void;
}

export function ProductCard({
    name,
    price,
    description,
    photo,
    category,
    onAddToCart
}: ProductCardProps) {
    // Generate a random emoji based on category name as fallback
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
        <div
            className="bg-white dark:bg-[#2d2a27] rounded-[2.5rem] p-8 border border-gray-50 dark:border-white/5 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:rotate-12 transition-transform duration-500 flex-shrink-0 ${getCategoryAccent()}`}>
                {photo ? (
                    <Image src={photo} alt={name} width={64} height={64} className="rounded-2xl object-cover" />
                ) : (
                    getEmoji()
                )}
            </div>
            <div className="flex-1 mb-8">
                <h3 className="text-2xl font-bold leading-tight mb-2 group-hover:text-[#af601a] transition-colors dark:text-white">
                    {name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    {description || `Handcrafted ${category.name.toLowerCase()} delight`}
                </p>
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50/50 dark:border-white/5">
                <span className="text-2xl font-black dark:text-white">
                    RM{price.toFixed(2)}
                </span>
                <button
                    onClick={onAddToCart}
                    className="p-4 bg-[#f9f7f2] dark:bg-white/5 rounded-2xl hover:bg-[#3e3a36] dark:hover:bg-white hover:text-white dark:hover:text-[#3e3a36] transition-all active:scale-90"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
}

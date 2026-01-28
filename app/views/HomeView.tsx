'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Product {
    productId: string;
    name: string;
    price: number;
    photo: string | null;
    description: string | null;
    category: {
        name: string;
    };
}

interface HomeViewProps {
    featuredProducts: Product[];
    onNavigateToShop: () => void;
    darkMode: boolean;
}

export function HomeView({ featuredProducts, onNavigateToShop, darkMode }: HomeViewProps) {
    const getEmoji = (categoryName: string) => {
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
        return emojis[categoryName.toLowerCase()] || '🍽️';
    };

    const getCategoryAccent = (categoryName: string) => {
        const accents: Record<string, string> = {
            'earth': 'bg-[#e8f3ee] dark:bg-emerald-900/30 text-[#2d5a27] dark:text-emerald-400',
            'fire': 'bg-[#fdeded] dark:bg-red-900/30 text-[#943126] dark:text-red-400',
            'water': 'bg-[#ebf5fb] dark:bg-blue-900/30 text-[#1b4f72] dark:text-blue-400',
            'air': 'bg-[#f4ecf7] dark:bg-purple-900/30 text-[#512e5f] dark:text-purple-400'
        };
        return accents[categoryName.toLowerCase()] || 'bg-[#fdf2e9] dark:bg-orange-900/30 text-[#af601a] dark:text-orange-400';
    };

    return (
        <div className="animate-in fade-in duration-700">
            <section className="relative h-[70vh] flex items-center rounded-[3rem] overflow-hidden bg-[#e8f3ee] dark:bg-emerald-950/20 mb-20 group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 dark:from-black/40 to-transparent pointer-events-none z-10" />
                <div className="relative z-20 px-12 md:px-20 max-w-2xl">
                    <span className="text-[#2d5a27] dark:text-emerald-400 font-bold uppercase tracking-[0.3em] text-xs mb-6 block">
                        Soulful Nourishment
                    </span>
                    <h2 className="text-7xl font-black italic leading-[0.9] mb-8 text-[#3e3a36] dark:text-white">
                        A Sanctuary <br /> for the <span className="text-transparent border-text" style={{ WebkitTextStroke: darkMode ? '1px #ffffff' : '1px #3e3a36' }}>Senses</span>
                    </h2>
                    <p className="text-[#3e3a36]/70 dark:text-white/60 text-lg mb-10 leading-relaxed font-medium">
                        Experience slow-crafted botanical delicacies harvested from our vertical glasshouse gardens.
                    </p>
                    <button
                        onClick={onNavigateToShop}
                        className="group flex items-center gap-4 bg-[#3e3a36] dark:bg-white dark:text-[#3e3a36] text-white px-10 py-5 rounded-full font-bold transition-all hover:bg-[#2d2a27] hover:gap-8"
                    >
                        Explore Menu <ArrowRight size={20} />
                    </button>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center opacity-20 md:opacity-100 transition-transform duration-1000 group-hover:scale-110">
                    <div className="text-[20rem]">🌿</div>
                </div>
            </section>

            <section className="mb-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h3 className="text-3xl font-black italic dark:text-white">Today&apos;s Harvest</h3>
                        <p className="text-gray-400 mt-1">Hand-picked selections for mindful dining.</p>
                    </div>
                    <button
                        onClick={onNavigateToShop}
                        className="text-[#c8a47e] font-bold text-sm underline underline-offset-8 uppercase tracking-widest hover:text-[#af601a]"
                    >
                        View All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map(item => (
                        <div
                            key={item.productId}
                            onClick={onNavigateToShop}
                            className="cursor-pointer group relative bg-white dark:bg-[#2d2a27] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500 ${getCategoryAccent(item.category.name)}`}>
                                {item.photo ? (
                                    <Image src={item.photo} alt={item.name} width={64} height={64} className="rounded-2xl object-cover" />
                                ) : (
                                    getEmoji(item.category.name)
                                )}
                            </div>
                            <h4 className="text-xl font-bold mb-2 group-hover:text-[#af601a] dark:text-white">
                                {item.name}
                            </h4>
                            <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">
                                {item.category.name} element
                            </p>
                            <div className="absolute bottom-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                                <div className="bg-[#3e3a36] dark:bg-white dark:text-[#3e3a36] text-white p-3 rounded-full">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

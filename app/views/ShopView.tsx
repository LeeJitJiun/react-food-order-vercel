'use client';

import { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { ProductCard } from '../../components/ui/ProductCard';

interface Product {
    productId: string;
    name: string;
    price: number;
    photo: string | null;
    description: string | null;
    category: {
        categoryId: string;
        name: string;
    };
}

interface Category {
    categoryId: string;
    name: string;
}

interface ShopViewProps {
    products: Product[];
    categories: Category[];
    onAddToCart: (product: Product) => void;
    darkMode: boolean;
}

export function ShopView({ products, categories, onAddToCart, darkMode }: ShopViewProps) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        return products.filter(item => {
            const matchCategory = activeCategory === 'all' || item.category.categoryId === activeCategory;
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [activeCategory, search, products]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div>
                    <div className="flex items-center gap-2 text-[#c8a47e] font-bold uppercase tracking-widest text-xs mb-2">
                        <Sparkles size={14} /> The Full Library
                    </div>
                    <h1 className="text-6xl font-black tracking-tight leading-none italic dark:text-white">
                        Botanical <span className="text-transparent border-text" style={{ WebkitTextStroke: darkMode ? '1px #ffffff' : '1px #3e3a36' }}>Selection</span>
                    </h1>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Discover flavors..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white dark:bg-[#2d2a27] border-none rounded-2xl pl-12 pr-6 py-4 w-full md:w-80 shadow-sm focus:ring-2 focus:ring-[#c8a47e]/20 transition-all text-sm outline-none dark:text-white"
                    />
                </div>
            </header>

            <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-8 py-4 rounded-full text-sm font-bold transition-all flex items-center gap-3 border whitespace-nowrap ${activeCategory === 'all'
                        ? 'bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] border-[#3e3a36] shadow-xl'
                        : 'bg-white dark:bg-[#2d2a27] text-[#3e3a36] dark:text-white border-gray-100 dark:border-white/5 hover:border-[#c8a47e]'
                        }`}
                >
                    <Sparkles size={16} />
                    All Elements
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.categoryId}
                        onClick={() => setActiveCategory(cat.categoryId)}
                        className={`px-8 py-4 rounded-full text-sm font-bold transition-all flex items-center gap-3 border whitespace-nowrap ${activeCategory === cat.categoryId
                            ? 'bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] border-[#3e3a36] shadow-xl'
                            : 'bg-white dark:bg-[#2d2a27] text-[#3e3a36] dark:text-white border-gray-100 dark:border-white/5 hover:border-[#c8a47e]'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filtered.map((product) => (
                    <ProductCard
                        key={product.productId}
                        {...product}
                        id={product.productId}
                        onAddToCart={() => onAddToCart(product)}
                    />
                ))}
            </div>
        </div>
    );
}

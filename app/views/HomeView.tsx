"use client";

import { ArrowRight, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  isGuest?: boolean;
}

export function HomeView({
  featuredProducts,
  onNavigateToShop,
  darkMode,
  isGuest = false,
}: HomeViewProps) {
  const router = useRouter();
  const getEmoji = (categoryName: string) => {
    const emojis: Record<string, string> = {
      earth: "🍄",
      fire: "🍔",
      water: "🦪",
      air: "☁️",
      drinks: "🍹",
      dessert: "🌋",
      salad: "🥗",
      pasta: "🍝",
    };
    return emojis[categoryName.toLowerCase()] || "🍽️";
  };

  const getCategoryAccent = (categoryName: string) => {
    const accents: Record<string, string> = {
      earth:
        "bg-[#e8f3ee] dark:bg-emerald-900/30 text-[#2d5a27] dark:text-emerald-400",
      fire: "bg-[#fdeded] dark:bg-red-900/30 text-[#943126] dark:text-red-400",
      water:
        "bg-[#ebf5fb] dark:bg-blue-900/30 text-[#1b4f72] dark:text-blue-400",
      air: "bg-[#f4ecf7] dark:bg-purple-900/30 text-[#512e5f] dark:text-purple-400",
    };
    return (
      accents[categoryName.toLowerCase()] ||
      "bg-[#fdf2e9] dark:bg-orange-900/30 text-[#af601a] dark:text-orange-400"
    );
  };

  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative min-h-[50vh] md:h-[70vh] flex items-center rounded-2xl md:rounded-[3rem] overflow-hidden bg-[#e8f3ee] dark:bg-emerald-950/20 mb-12 md:mb-20 group">
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 dark:from-black/40 to-transparent pointer-events-none z-10" />
        <div className="relative z-20 px-6 sm:px-8 md:px-12 lg:px-20 max-w-2xl py-12 md:py-0">
          <span className="text-[#2d5a27] dark:text-emerald-400 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs mb-4 md:mb-6 block">
            Soulful Nourishment
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic leading-[0.9] mb-6 md:mb-8 text-[#3e3a36] dark:text-white">
            A Sanctuary <br /> for the{" "}
            <span
              className="text-transparent border-text"
              style={{
                WebkitTextStroke: darkMode ? "1px #ffffff" : "1px #3e3a36",
              }}
            >
              Senses
            </span>
          </h2>
          <p className="text-[#3e3a36]/70 dark:text-white/60 text-base md:text-lg mb-8 md:mb-10 leading-relaxed font-medium">
            Experience slow-crafted botanical delicacies harvested from our
            vertical glasshouse gardens.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
            <button
              onClick={onNavigateToShop}
              className="group flex items-center justify-center gap-3 md:gap-4 bg-[#3e3a36] dark:bg-white dark:text-[#3e3a36] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold transition-all hover:bg-[#2d2a27] hover:gap-6 text-sm md:text-base"
            >
              Explore Menu <ArrowRight size={18} className="md:w-5 md:h-5" />
            </button>
            {isGuest && (
              <button
                onClick={() => router.push("/login")}
                className="group flex items-center justify-center gap-2 md:gap-3 bg-transparent border-2 border-[#3e3a36] dark:border-white text-[#3e3a36] dark:text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold transition-all hover:bg-[#3e3a36] hover:text-white dark:hover:bg-white dark:hover:text-[#3e3a36] text-sm md:text-base"
              >
                <LogIn size={18} className="md:w-5 md:h-5" />
                Login
              </button>
            )}
          </div>
        </div>
        <div className="hidden md:flex absolute right-0 top-0 h-full w-1/2 items-center justify-center opacity-20 md:opacity-100 transition-transform duration-1000 group-hover:scale-110">
          <div className="text-[10rem] lg:text-[20rem]">🌿</div>
        </div>
      </section>

      <section className="mb-12 md:mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-12">
          <div>
            <h3 className="text-2xl md:text-3xl font-black italic dark:text-white">
              Today&apos;s Harvest
            </h3>
            <p className="text-gray-400 mt-1 text-sm md:text-base">
              Hand-picked selections for mindful dining.
            </p>
          </div>
          <button
            onClick={onNavigateToShop}
            className="text-[#c8a47e] font-bold text-xs md:text-sm underline underline-offset-8 uppercase tracking-widest hover:text-[#af601a]"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((item) => (
            <div
              key={item.productId}
              onClick={onNavigateToShop}
              className="cursor-pointer group relative bg-white dark:bg-[#2d2a27] p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 ${getCategoryAccent(item.category.name)}`}
              >
                {item.photo ? (
                  <Image
                    src={item.photo}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-2xl object-cover"
                  />
                ) : (
                  getEmoji(item.category.name)
                )}
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 group-hover:text-[#af601a] dark:text-white">
                {item.name}
              </h4>
              <p className="text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-widest">
                {item.category.name} element
              </p>
              <div className="absolute bottom-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="bg-[#3e3a36] dark:bg-white dark:text-[#3e3a36] text-white p-2.5 md:p-3 rounded-full">
                  <ArrowRight size={14} className="md:w-4 md:h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

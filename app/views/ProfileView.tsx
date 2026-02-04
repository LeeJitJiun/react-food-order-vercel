"use client";

import {
  Mail,
  Settings,
  CreditCard,
  ShieldCheck,
  Clock,
  LogOut,
  UserPlus,
  LogIn,
} from "lucide-react";
import { ProfileCard } from "../../components/ui/ProfileCard";
import { useRouter } from "next/navigation";

interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface ProfileViewProps {
  user: User | null;
  ordersCount: number;
  onLogout?: () => void;
  onEditProfile?: () => void;
}

export function ProfileView({
  user,
  ordersCount,
  onLogout,
  onEditProfile,
}: ProfileViewProps) {
  const router = useRouter();

  // Guest View
  if (!user) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="max-w-4xl">
          <div className="bg-white dark:bg-[#2d2a27] rounded-[3rem] p-12 mb-8 border border-gray-100 dark:border-white/5">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-5xl">
                👤
              </div>
              <div>
                <h1 className="text-4xl font-black italic dark:text-white mb-2">
                  Guest User
                </h1>
                <p className="text-gray-400 mb-6">
                  You are browsing as a guest. Login to unlock the full Oasis
                  experience.
                </p>
              </div>

              <div className="flex gap-4 flex-wrap justify-center">
                <button
                  onClick={() => router.push("/login")}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 font-medium text-lg"
                >
                  <LogIn size={20} />
                  Login to Your Account
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-gray-800 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-800 hover:text-white dark:hover:bg-gray-700 transition-all duration-300 font-medium text-lg"
                >
                  <UserPlus size={20} />
                  Create Account
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold dark:text-white mb-4">
              What you'll get with an account:
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Place orders and enjoy our botanical delicacies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>View your order history and track deliveries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Save your favorite items</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Manage payment methods and delivery addresses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Exclusive member benefits and loyalty rewards</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated User View
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="max-w-4xl">
        <div className="bg-white dark:bg-[#2d2a27] rounded-[3rem] p-12 mb-8 border border-gray-100 dark:border-white/5">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-[#fcf3cf] dark:bg-yellow-900/30 flex items-center justify-center overflow-hidden text-5xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "👤"
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
                <h1 className="text-4xl font-black italic dark:text-white">
                  {user.username}
                </h1>
                <span className="px-4 py-1.5 bg-[#c8a47e]/10 text-[#af601a] rounded-full text-xs font-black uppercase tracking-tighter self-center">
                  {user.role} Tier
                </span>
              </div>
              <p className="text-gray-400 mb-6 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {user.email}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Harvests
                  </p>
                  <p className="text-xl font-black dark:text-white">
                    {ordersCount}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Member Since
                  </p>
                  <p className="text-xl font-black dark:text-white">2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProfileCard
            icon={CreditCard}
            title="Payments"
            desc="Manage your botanical cards"
          />
          <ProfileCard
            icon={ShieldCheck}
            title="Privacy"
            desc="Your data is encrypted by light"
          />
          <ProfileCard
            icon={Clock}
            title="Cycles"
            desc="Subscription & loyalty settings"
          />
          <ProfileCard
            icon={LogOut}
            title="Leave Oasis"
            desc="Logout from the garden"
            destructive
            onClick={onLogout}
          />
        </div>
      </div>
    </div>
  );
}

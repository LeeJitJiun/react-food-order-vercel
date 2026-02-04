"use client";

import { Leaf, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthRequiredPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ed] to-[#e8f3ee] dark:from-gray-900 dark:to-emerald-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="bg-gray-800 dark:bg-gray-700 rounded-2xl p-4">
            <Leaf className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Lock Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 dark:bg-amber-500/10 blur-2xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-full p-8">
              <Lock className="w-16 h-16 text-amber-700 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-serif italic text-gray-800 dark:text-gray-100">
            Authentication Required
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please login to access this page and enjoy the full Oasis experience
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => router.push("/login")}
            className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 font-medium text-lg"
          >
            Login to Continue
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push("/register")}
            className="w-full px-8 py-4 bg-transparent border-2 border-gray-800 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-800 hover:text-white dark:hover:bg-gray-700 transition-all duration-300 font-medium text-lg"
          >
            Create an Account
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full px-8 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <strong className="text-gray-800 dark:text-gray-200">
              Guest Access:
            </strong>{" "}
            You can browse our menu and learn about Oasis without logging in.
            However, to place orders, view history, or manage your profile,
            you'll need to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}

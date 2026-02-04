"use client";

import { ArrowRight, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ed] to-[#e8f3ee] dark:from-gray-900 dark:to-emerald-950">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-gray-800 dark:bg-gray-700 rounded-2xl p-3">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-serif italic text-gray-800 dark:text-gray-100">
            Oasis
          </h1>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 font-medium"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-sm tracking-[0.3em] text-gray-600 dark:text-gray-400 uppercase font-medium">
                Soulful Nourishment
              </p>
              <h2 className="text-6xl md:text-7xl font-serif leading-tight">
                <span className="text-gray-800 dark:text-gray-100 italic">
                  A Sanctuary
                </span>
                <br />
                <span className="text-gray-800 dark:text-gray-100 italic">
                  for the
                </span>
                <br />
                <span className="text-gray-800 dark:text-gray-100 italic outline-text">
                  Senses
                </span>
              </h2>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              Experience slow-crafted botanical delicacies harvested from our
              vertical glasshouse gardens.
            </p>

            <button
              onClick={() => router.push("/menu")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 font-medium text-lg"
            >
              Explore Menu
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative animate-float">
              <svg
                viewBox="0 0 200 200"
                className="w-96 h-96"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Stem */}
                <path
                  d="M 100 200 Q 95 150 100 100 Q 105 50 100 0"
                  fill="none"
                  stroke="#7a9b85"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Leaves */}
                <ellipse
                  cx="70"
                  cy="140"
                  rx="35"
                  ry="50"
                  fill="#c8e6c9"
                  className="animate-sway"
                  style={{ transformOrigin: "100px 140px" }}
                />
                <ellipse
                  cx="130"
                  cy="100"
                  rx="40"
                  ry="55"
                  fill="#b4d8b4"
                  className="animate-sway-delayed"
                  style={{ transformOrigin: "100px 100px" }}
                />
                <ellipse
                  cx="75"
                  cy="70"
                  rx="38"
                  ry="52"
                  fill="#a8d5a8"
                  className="animate-sway"
                  style={{ transformOrigin: "100px 70px" }}
                />
                <ellipse
                  cx="130"
                  cy="40"
                  rx="42"
                  ry="58"
                  fill="#9ed49e"
                  className="animate-sway-delayed"
                  style={{ transformOrigin: "100px 40px" }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Today's Harvest Section Preview */}
        <div className="mt-32">
          <h3 className="text-4xl font-serif italic text-gray-800 dark:text-gray-100 mb-8">
            Today's Harvest
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Discover our fresh botanical creations.
            <button
              onClick={() => router.push("/menu")}
              className="ml-2 text-gray-800 dark:text-gray-100 underline hover:no-underline font-medium"
            >
              Browse our full menu
            </button>
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes sway-delayed {
          0%,
          100% {
            transform: rotate(2deg);
          }
          50% {
            transform: rotate(-2deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }

        .animate-sway-delayed {
          animation: sway-delayed 4s ease-in-out infinite;
        }

        .outline-text {
          color: transparent;
          -webkit-text-stroke: 2px #4a5568;
          text-stroke: 2px #4a5568;
        }

        :global(.dark) .outline-text {
          -webkit-text-stroke: 2px #cbd5e0;
          text-stroke: 2px #cbd5e0;
        }
      `}</style>
    </div>
  );
}

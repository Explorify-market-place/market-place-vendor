// components/landing/Hero.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
  onSearch?: (q: string) => void;
};

export default function Hero({ onSearch }: Props) {
  const [q, setQ] = useState("");

  // simple debounce so we don't call onSearch too often while typing
  useEffect(() => {
    const t = setTimeout(() => {
      onSearch?.(q.trim());
    }, 220);
    return () => clearTimeout(t);
  }, [q, onSearch]);

  return (
    <section className="relative">
      <div
        className="h-[56vh] md:h-[64vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=fa5ff6e2ad5b4e6e33a3b8c7a9f0e3ec')",
        }}
      >
        <div className="h-full bg-gradient-to-b from-black/25 to-white/10 flex items-center">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg max-w-4xl leading-tight">
              Discover & book things to do
            </h1>
            <p className="mt-4 text-lg text-white/90 max-w-2xl">
              Find tours, activities and experiences handpicked for every
              traveler.
            </p>

            <div className="mt-8">
              <div className="max-w-3xl mx-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSearch?.(q.trim());
                  }}
                  className="w-full"
                >
                  <div className="flex items-center gap-4 hero-search-pill rounded-full bg-white p-2">
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Find places and things to do (e.g. Goa, Kerala)"
                      className="flex-1 px-6 py-4 rounded-full text-lg outline-none"
                      aria-label="Hero search"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold shadow"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/packages"
                className="px-4 py-2 rounded-full bg-white text-slate-800 font-medium"
              >
                Browse all packages
              </Link>
              <Link
                href="/vendor/signup"
                className="px-4 py-2 rounded-full bg-transparent border border-white/40 text-white"
              >
                Become a vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

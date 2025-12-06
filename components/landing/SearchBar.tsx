// components/landing/SearchBar.tsx
"use client";
import { useState, useEffect } from "react";

export default function SearchBar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [q, setQ] = useState("");

  // simple debounce so we don't flood updates on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      onSearch?.(q.trim());
    }, 220);
    return () => clearTimeout(t);
  }, [q, onSearch]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 hero-search-pill rounded-full bg-white p-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find places and things to do (try 'Goa', 'Kerala', 'Himalayan')"
            className="flex-1 px-6 py-4 rounded-full text-lg outline-none"
            aria-label="Search packages"
          />
          <button aria-label="Search" className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold shadow" type="button" onClick={() => onSearch?.(q.trim())}>
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

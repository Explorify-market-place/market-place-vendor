// components/layouts/Header.tsx
"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

function Dropdown({ title, items }: { title: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="px-3 py-2 rounded-md hover:bg-slate-100"
      >
        {title} <span className="ml-1">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border p-3 z-50">
          <ul className="space-y-2 text-sm">
            {items.map((it) => (
              <li key={it}>
                <Link
                  href={`/search?term=${encodeURIComponent(it)}`}
                  className="block px-2 py-1 hover:bg-slate-50 rounded"
                >
                  {it}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6d28d9] to-pink-500 flex items-center justify-center text-white font-bold">
              E
            </div>
            <div className="hidden md:block">
              <div className="text-lg font-semibold">Explorify</div>
              <div className="text-xs text-slate-500">Travel packages marketplace</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-3">
            <Dropdown title="Places to see" items={["Rome", "Paris", "New York", "Goa", "Kerala"]} />
            <Dropdown title="Things to do" items={["Guided tours", "Entry tickets", "Day trips", "Food & culture"]} />
            <Dropdown title="Trip inspiration" items={["Family trips", "Couples", "Luxury", "Budget"]} />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-slate-600">
            <Link href="/wishlist" className="flex items-center gap-2">Wishlist</Link>
            <Link href="/cart" className="flex items-center gap-2">Cart</Link>
            <Link href="/profile" className="flex items-center gap-2">Profile</Link>
          </div>

          {/* theme toggle - minimal placement */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/auth/signin"
              className="px-3 py-2 rounded-full bg-[#6d28d9] text-white text-sm shadow"
            >
              Vendor Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

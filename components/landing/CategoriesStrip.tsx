// components/landing/CategoriesStrip.tsx
"use client";
import Link from "next/link";

const categories = [
  { name: "Top attractions", sub: "worldwide" },
  { name: "Top destinations", sub: "cities" },
  { name: "Weekend trips", sub: "short escapes" },
  { name: "Beach", sub: "sun & sea" },
  { name: "Adventure", sub: "thrill" },
];

export default function CategoriesStrip() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link key={c.name} href={`/search?cat=${encodeURIComponent(c.name)}`} className="min-w-[220px] p-4 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-sm">
              <div className="text-sm text-slate-500">{c.sub}</div>
              <div className="font-semibold text-lg">{c.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

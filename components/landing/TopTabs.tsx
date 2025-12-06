// components/landing/TopTabs.tsx
"use client";
import { useState } from "react";
import Carousel from "./Carousel";
import PackageCard from "@/components/Cards/PackageCard";

export default function TopTabs({ items }: { items: Array<any> }) {
  const tabs = ["Top attractions worldwide", "Top destinations", "Top countries to visit", "Top attraction categories"];
  const [active, setActive] = useState(0);

  // filter items based on active tab for demo
  const filtered = items.filter((p) => {
    if (active === 0) return true;
    if (active === 1) return p.type === "Destination";
    if (active === 2) return p.type === "Attraction";
    return true;
  });

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 border-b pb-4 overflow-auto">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActive(i)} className={`pb-3 ${i === active ? "border-b-4 border-indigo-600 text-slate-900" : "text-slate-600"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Carousel>
            {filtered.map((p) => (
              <div key={p.id} className="min-w-[320px] max-w-[320px]">
                <PackageCard id={p.id} title={p.title} price={p.price} location={p.location} days={p.days} rating={p.rating} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

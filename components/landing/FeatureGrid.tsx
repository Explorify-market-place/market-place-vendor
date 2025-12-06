// components/landing/FeatureGrid.tsx
"use client";
import { samplePackages } from "@/lib/mockPackages";
import Link from "next/link";

function Card({ item }: { item: (typeof samplePackages)[number] }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden card-shadow">
      <div className="h-44 bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center">
        <img src={`https://picsum.photos/seed/${item.id}/600/360`} alt={item.title} className="object-cover w-full h-full" />
      </div>

      <div className="p-4">
        <div className="text-xs text-slate-500 uppercase">Guided tour</div>
        <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
        <div className="mt-2 text-sm text-slate-500">{item.days} • {item.location}</div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-indigo-600 font-bold">{item.price}</div>
            <div className="text-xs text-slate-400">per person</div>
          </div>
          <Link href={`/packages/${item.id}`} className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm">Book</Link>
        </div>
      </div>
    </article>
  );
}

export default function FeatureGrid() {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Unforgettable travel experiences</h2>
          <a className="text-indigo-600" href="/packages">See all</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePackages.map((p) => <Card key={p.id} item={p} />)}
        </div>
      </div>
    </section>
  );
}

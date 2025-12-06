// components/landing/MorePackages.tsx
"use client";
import PackageCard from "@/components/Cards/PackageCard";

export default function MorePackages({ items }: { items: Array<any> }) {
  const show = items.slice(0, 6); // show only first 6

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">More packages</h2>
          <a className="text-indigo-600" href="/packages">
            See all
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {show.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-white rounded-2xl">
              No packages found for your search.
            </div>
          ) : (
            show.map((p: any) => (
              <PackageCard
                key={p.id}
                id={p.id}
                title={p.title}
                price={p.price}
                location={p.location}
                days={p.days}
                rating={p.rating}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

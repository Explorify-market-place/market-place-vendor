// app/search/page.tsx
import React from "react";
import { searchPackages, Package } from "@/lib/mockPackages";
import PackageCard from "@/components/Cards/PackageCard";
import Link from "next/link";

type Props = {
  searchParams?: { term?: string } | Promise<{ term?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  // Next requires awaiting searchParams before accessing properties
  const sp = await searchParams;
  const term = sp?.term ?? "";

  const results: Package[] = searchPackages(term);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search results</h1>
        <p className="text-slate-600 mt-2">
          Showing results for <strong>{term || "all packages"}</strong>
        </p>
      </div>

      {results.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-700">No packages found for "{term}".</p>
          <div className="mt-4">
            <Link href="/" className="text-indigo-600 underline">Back to home</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((p) => (
            <div key={p.id}>
              <PackageCard
                id={p.id}
                title={p.title}
                days={p.days}
                price={p.price}
                rating={p.rating}
                image={(p as any).image}
                location={p.location}
                city={(p as any).city}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

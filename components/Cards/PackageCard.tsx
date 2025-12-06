// components/Cards/PackageCard.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
  id: number;
  title: string;
  price: string;
  location: string;
  days: string;
  rating?: number;
  image?: string; // optional image
  city?: string;  // optional city (alias for location)
};

export default function PackageCard({ id, title, price, location, days, rating, image, city }: Props) {
  const storageKey = "explorify_wishlist_v1";
  const [wish, setWish] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const arr = raw ? JSON.parse(raw) : [];
      setWish(arr.includes(id));
    } catch {
      setWish(false);
    }
  }, [id]);

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const raw = localStorage.getItem(storageKey);
      const arr: number[] = raw ? JSON.parse(raw) : [];
      let next: number[];
      if (arr.includes(id)) next = arr.filter((x) => x !== id);
      else next = [...arr, id];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setWish(!wish);
    } catch {
      setWish(!wish);
    }
  };

  // prefer provided image; fallback to picsum seed
  const imgSrc = image && image.length > 0 ? image : `https://picsum.photos/seed/pkg${id}/800/480`;
  const displayLocation = city ?? location;

  return (
    <Link href={`/packages/${id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative h-44 bg-slate-100 flex items-center justify-center">
        <img src={imgSrc} alt={title} className="object-cover w-full h-full" />
        <button onClick={toggleWish} aria-label="Wishlist" className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
          {wish ? (
            <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 21s-7-4.35-9-7.1C-1 9 5 4 12 8c7-4 13 1 9 5.9-2 2.75-9 7.1-9 7.1z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20.8 8.6c0 6.1-8.8 11.7-8.8 11.7S3.2 14.7 3.2 8.6C3.2 5 5.9 3 8.6 3c1.7 0 3.1.8 4 2 0.9-1.2 2.3-2 4-2 2.7 0 5.4 2 5.4 5.6z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="text-xs text-slate-500 uppercase">Experience</div>
        <h3 className="text-lg font-semibold mt-1">{title}</h3>
        <div className="mt-2 text-sm text-slate-500">{days} • {displayLocation}</div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-indigo-600 font-bold">{price}</div>
            <div className="text-xs text-slate-400">per person</div>
          </div>
          <div className="text-sm text-slate-500">⭐ {rating ?? 4.5}</div>
        </div>
      </div>
    </Link>
  );
}

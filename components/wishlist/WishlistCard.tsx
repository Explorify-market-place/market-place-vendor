// components/wishlist/WishlistCard.tsx
"use client";
import React from "react";

type Item = {
  id: string;
  title: string;
  location?: string;
  price?: number;
  rating?: number;
  image?: string | null;
};

export default function WishlistCard({
  item,
  onRemove,
  onAddToCart,
}: {
  item: Item;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border rounded-2xl shadow-sm overflow-hidden">
      <div className="md:flex">
        <div className="w-full md:w-44 h-36 md:h-auto relative">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
          ) : (
            <div className="bg-slate-100 dark:bg-slate-700 w-full h-full flex items-center justify-center text-lg">
              No image
            </div>
          )}
        </div>

        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold text-lg">{item.title}</div>
              <div className="text-sm text-slate-500 mt-1">{item.location ?? "Unknown location"}</div>
            </div>

            <div className="text-right">
              <div className="text-indigo-600 font-bold">₹{item.price?.toLocaleString() ?? "-"}</div>
              <div className="text-sm text-slate-500 mt-1">⭐ {item.rating?.toFixed(1) ?? "—"}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => onAddToCart(item.id)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add to cart
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="px-4 py-2 border rounded-md text-slate-600 hover:bg-slate-50"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

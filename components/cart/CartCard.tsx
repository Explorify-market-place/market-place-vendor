// components/cart/CartCard.tsx
"use client";
import React from "react";

type CartItem = {
  id: string;
  title: string;
  location?: string;
  price: number;
  qty: number;
  image?: string | null;
  rating?: number;
};

export default function CartCard({
  item,
  onChangeQty,
  onRemove,
}: {
  item: CartItem;
  onChangeQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border rounded-2xl p-4 flex gap-4 items-start shadow-sm">
      <div className="w-28 h-20 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">No image</div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold text-lg">{item.title}</div>
            <div className="text-sm text-slate-500">{item.location ?? "Location unknown"}</div>
            <div className="text-sm text-amber-500 mt-1">⭐ {item.rating ?? 0}</div>
          </div>

          <div className="text-right">
            <div className="font-bold text-indigo-600 text-lg">₹{item.price.toLocaleString()}</div>
            <div className="text-sm text-slate-500">per person</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
            <button
              className="px-2 py-1"
              onClick={() => onChangeQty(item.id, Math.max(1, item.qty - 1))}
              aria-label="Decrease"
            >
              −
            </button>
            <div className="w-8 text-center">{item.qty}</div>
            <button className="px-2 py-1" onClick={() => onChangeQty(item.id, item.qty + 1)} aria-label="Increase">
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="px-3 py-2 border rounded-md text-sm text-slate-600 hover:bg-slate-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

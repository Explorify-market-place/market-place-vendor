// components/wishlist/WishlistList.tsx
"use client";
import React, { useState } from "react";
import WishlistCard from "./WishlistCard";

type Item = {
  id: string;
  title: string;
  location?: string;
  price?: number;
  rating?: number;
  image?: string | null;
};

const initialMock: Item[] = [
  {
    id: "p1",
    title: "Kerala Backwaters & Ayurvedic Retreat",
    location: "Kerala",
    price: 12999,
    rating: 4.8,
    image: "/mock/kerala.jpg",
  },
  {
    id: "p2",
    title: "Goa Watersports Weekend",
    location: "Goa",
    price: 5499,
    rating: 4.6,
    image: "/mock/goa.jpg",
  },
  {
    id: "p3",
    title: "Mumbai City Lights: Evening Tour",
    location: "Mumbai",
    price: 2499,
    rating: 4.5,
    image: "/mock/mumbai.jpg",
  },
];

export default function WishlistList() {
  const [items, setItems] = useState<Item[]>(initialMock);
  const [message, setMessage] = useState<string | null>(null);

  function handleRemove(id: string) {
    setItems((s) => s.filter((i) => i.id !== id));
    setMessage("Removed from wishlist");
    setTimeout(() => setMessage(null), 1800);
  }

  function handleAddToCart(id: string) {
    // future: call API to add to cart
    setMessage("Added to cart");
    // keep the item in wishlist for now — change if you want auto-remove
    setTimeout(() => setMessage(null), 1600);
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border rounded-2xl p-8 text-center shadow-sm">
        <div className="text-lg font-semibold mb-2">Your wishlist is empty</div>
        <div className="text-sm text-slate-500">Browse packages and add them to your wishlist to save for later.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && <div className="text-sm text-slate-700 bg-green-50 rounded-md p-2">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <WishlistCard key={it.id} item={it} onRemove={handleRemove} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}

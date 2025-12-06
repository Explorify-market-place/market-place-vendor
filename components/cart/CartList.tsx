// components/cart/CartList.tsx
"use client";
import React, { useMemo, useState } from "react";
import CartCard from "./CartCard";

type CartItem = {
  id: string;
  title: string;
  location?: string;
  price: number;
  qty: number;
  image?: string | null;
  rating?: number;
};

const initialMock: CartItem[] = [
  { id: "c1", title: "Kerala Backwaters & Ayurvedic Retreat", location: "Kerala", price: 12999, qty: 1, image: "/mock/kerala.jpg", rating: 4.8 },
  { id: "c2", title: "Goa Watersports Weekend", location: "Goa", price: 5499, qty: 2, image: "/mock/goa.jpg", rating: 4.6 },
];

export default function CartList() {
  const [items, setItems] = useState<CartItem[]>(initialMock);
  const [message, setMessage] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  function changeQty(id: string, qty: number) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, qty } : it)));
  }

  function remove(id: string) {
    setItems((s) => s.filter((i) => i.id !== id));
    setMessage("Removed from cart");
    setTimeout(() => setMessage(null), 1500);
  }

  async function handleCheckout() {
    // placeholder: later replace with real checkout flow / API
    setMessage("Starting checkout…");
    setTimeout(() => setMessage("Checkout not implemented in mock."), 1000);
    setTimeout(() => setMessage(null), 2400);
  }

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border rounded-2xl p-8 text-center shadow-sm">
        <div className="text-lg font-semibold mb-2">Your cart is empty</div>
        <div className="text-sm text-slate-500">Browse packages and add them to the cart to checkout.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {message && <div className="text-sm text-slate-700 bg-green-50 rounded-md p-2">{message}</div>}
        {items.map((it) => (
          <CartCard key={it.id} item={it} onChangeQty={changeQty} onRemove={remove} />
        ))}
      </div>

      <aside className="bg-white dark:bg-slate-800 border rounded-2xl p-6 shadow-sm h-fit">
        <div className="text-sm text-slate-500">Summary</div>
        <div className="flex items-center justify-between mt-3">
          <div>Subtotal</div>
          <div className="font-semibold">₹{subtotal.toLocaleString()}</div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>Service fee (5%)</div>
          <div className="font-semibold">₹{serviceFee.toLocaleString()}</div>
        </div>

        <div className="border-t my-4"></div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">Total</div>
          <div className="text-xl font-extrabold text-indigo-600">₹{total.toLocaleString()}</div>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
        >
          Proceed to checkout
        </button>

        <div className="mt-3 text-sm text-slate-500">You won't be charged in this mock.</div>
      </aside>
    </div>
  );
}

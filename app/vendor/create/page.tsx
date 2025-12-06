// app/vendor/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreatePackagePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const vendorId = (session as any)?.user?.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [routeText, setRouteText] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) { alert("Please fill name and price"); return; }
    setLoading(true);
    try {
      const body = {
        vendorId,
        name,
        price: Number(price),
        image: "", // optional: upload later
        route: routeText.split(",").map(s => s.trim()).filter(Boolean),
        description,
      };
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = await res.json();
      // Redirect to vendor dashboard or edit page
      router.push("/vendor/dashboard");
    } catch (err: any) {
      alert(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold">Create package</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (number)</label>
          <input value={price} onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))} type="number" className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Route (comma separated)</label>
          <input value={routeText} onChange={e => setRouteText(e.target.value)} placeholder="Goa, Palolem, Dudhsagar" className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-white">
            {loading ? "Creating..." : "Create package"}
          </button>
          <button type="button" onClick={() => router.push("/vendor/dashboard")} className="text-indigo-600 underline">Cancel</button>
        </div>
      </form>
    </main>
  );
}

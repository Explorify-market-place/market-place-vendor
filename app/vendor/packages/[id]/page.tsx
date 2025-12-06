// app/vendor/packages/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type Plan = {
  planId: string;
  name: string;
  price: number;
  route?: string[];
  description?: string;
  isActive?: boolean;
};

export default function EditPackagePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchPlan() {
    try {
      const res = await fetch(`/api/plans/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      alert("Cannot load plan");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!plan) return;
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: plan.name,
          price: plan.price,
          route: plan.route,
          description: plan.description,
          isActive: plan.isActive,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.push("/vendor/dashboard");
    } catch (err: any) {
      alert(err.message || "Update failed");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!plan) return <div>Plan not found.</div>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold">Edit package</h1>
      <form onSubmit={handleSave} className="space-y-4 mt-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input value={plan.name} onChange={e => setPlan({ ...plan, name: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input type="number" value={plan.price} onChange={e => setPlan({ ...plan, price: Number(e.target.value) })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Route (comma separated)</label>
          <input value={(plan.route || []).join(", ")} onChange={e => setPlan({ ...plan, route: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={plan.description || ""} onChange={e => setPlan({ ...plan, description: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div className="flex gap-3">
          <button className="rounded bg-indigo-600 px-4 py-2 text-white">Save</button>
          <button type="button" onClick={() => router.push("/vendor/dashboard")} className="text-indigo-600 underline">Cancel</button>
        </div>
      </form>
    </main>
  );
}

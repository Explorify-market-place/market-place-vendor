// app/vendor/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PackageCard from "@/components/Cards/PackageCard";

type Plan = {
  planId: string;
  vendorId: string;
  name: string;
  image?: string;
  route?: string[];
  description?: string;
  price: number;
  isActive?: boolean;
};

export default function VendorDashboardPage() {
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // derive vendorId from NextAuth session OR demo localStorage
  const sessionVendorId = (session as any)?.user?.id ?? null;
  const [vendorId, setVendorId] = useState<string | null>(sessionVendorId ?? null);

  // store demo user (from localStorage) if available
  const [storedUser, setStoredUser] = useState<any | null>(null);

  // When next-auth session becomes available update vendorId
  useEffect(() => {
    if (sessionVendorId) setVendorId(String(sessionVendorId));
  }, [sessionVendorId]);

  // Demo fallback: if no next-auth session, try localStorage for vendor_user (written by signin)
  useEffect(() => {
    if (vendorId) return; // already set from next-auth
    try {
      const raw = localStorage.getItem("vendor_user");
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.id) {
          setVendorId(String(user.id));
          setStoredUser(user);
        }
      }
    } catch (e) {
      // ignore localStorage parse errors
    }
  }, [vendorId]);

  useEffect(() => {
    if (!vendorId) return;
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  async function fetchPlans() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/plans?vendorId=${encodeURIComponent(vendorId as string)}`);
      if (!res.ok) throw new Error("Failed to fetch plans");
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err: any) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function deletePlan(id: string) {
    if (!confirm("Delete this package? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      // refresh
      setPlans((p) => p.filter((x) => x.planId !== id));
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  }

  if (status === "loading") return <div className="p-8">Loading...</div>;
  // If neither next-auth session nor demo vendor id exist, require sign in
  if (!session && !vendorId) return <div className="p-8">Please sign in to access the vendor dashboard.</div>;

  // display name: next-auth session takes priority, then stored demo user
  const displayName =
    (session as any)?.user?.name ||
    (session as any)?.user?.email ||
    storedUser?.name ||
    storedUser?.email ||
    "Vendor";

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
      <p className="text-slate-600 mt-2">Signed in as <strong>{displayName}</strong></p>

      <div className="mt-6 flex gap-3">
        <Link href="/vendor/create" className="rounded bg-indigo-600 text-white px-4 py-2">Create package</Link>
        <Link href="/" className="text-indigo-600 underline">Back to site</Link>
      </div>

      <section className="mt-8">
        {loading && <div>Loading packages...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && plans.length === 0 && (
          <div className="p-6 bg-white rounded shadow text-center">You have no packages yet.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {plans.map((p) => (
            <div key={p.planId} className="relative">
              {/* Reuse PackageCard but we pass props matching it */}
              <PackageCard
                id={Number(p.planId) || 0} // PackageCard expects a numeric id in your code; if you use uuid, adapt PackageCard later.
                title={p.name}
                price={`₹${p.price}`}
                location={p.route?.[0] ?? ""}
                days={`${(p.route?.length ?? 1)} days`}
                rating={4.5}
              />
              <div className="mt-2 flex gap-2 justify-end">
                <Link href={`/vendor/packages/${p.planId}`} className="text-sm text-indigo-600 underline">Edit</Link>
                <button onClick={() => deletePlan(p.planId)} className="text-sm text-red-600 underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

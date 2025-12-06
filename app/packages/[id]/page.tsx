// app/packages/[id]/page.tsx
import React from "react";
import MorePackages from "@/components/landing/MorePackages";
import { samplePackages } from "@/lib/mockPackages";
import Link from "next/link";

type Props = { params: { id: string } };

export default async function PackageDetailPage({ params }: Props) {
  const id = params.id;

  // Try to fetch from your server API
  let planData: any = null;
  try {
    // If you prefer internal call, use NEXT_PUBLIC_API_URL or empty to call same origin.
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${base}/api/plans/${id}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      planData = json.plan ?? null;
    }
  } catch (err) {
    console.error("Plan fetch error:", err);
  }

  // Fallback: if no plan found, show a simple not-found block
  if (!planData) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="py-20 text-center">
          <h1 className="text-3xl font-bold">Package not found</h1>
          <p className="text-slate-700 mt-4">We could not find the package you're looking for.</p>
          <div className="mt-6">
            <Link href="/" className="text-indigo-600 underline">Back to home</Link>
          </div>
        </div>
      </main>
    );
  }

  // Render minimal details from planData
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{planData.name}</h1>
      {planData.image && <img src={planData.image} alt={planData.name} className="w-full rounded-lg mb-6" />}
      <div className="text-slate-700 mb-6">{planData.description}</div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-xl font-bold">Price: ₹{planData.price}</div>
        <div className="text-sm text-slate-500">Vendor: {planData.vendorId}</div>
      </div>

      {/* Show other packages as suggestions */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">More packages</h2>
        <MorePackages items={samplePackages} />
      </div>
    </main>
  );
}

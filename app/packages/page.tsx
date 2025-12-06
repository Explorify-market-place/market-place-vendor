import React from "react";
import MorePackages from "@/components/landing/MorePackages";
import { samplePackages } from "@/lib/mockPackages";

export default function PackagesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">All packages</h1>
      <MorePackages items={samplePackages} />
    </main>
  );
}

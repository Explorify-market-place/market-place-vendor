// app/page.tsx

"use client"
import { useMemo, useState } from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Hero from "@/components/landing/Hero";
import TopTabs from "@/components/landing/TopTabs";
import MorePackages from "@/components/landing/MorePackages";
import Reviews from "@/components/landing/Reviews";
import { samplePackages } from "@/lib/mockPackages";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return samplePackages;
    return samplePackages.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.days && p.days.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  return (
    <>
      <Header />

      <main>
        {/* pass onSearch so hero search updates page-level filter */}
        <Hero onSearch={(q) => setSearchQuery(q)} />

        {/* removed the duplicate floating search here (was previously under Hero) */}

        <TopTabs items={filtered} />
        <MorePackages items={filtered} />
        <Reviews />
      </main>

      <Footer />
    </>
  );
}

// app/wishlist/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import WishlistList from "@/components/wishlist/WishlistList";

/**
 * Wishlist page — client protected.
 * - redirects unauthenticated users to /auth/signin
 * - shows wishlist items (mock). Replace with fetch('/api/wishlist') later.
 */

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-500">Loading wishlist…</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 pb-12">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Your wishlist</h1>
        <p className="text-sm text-slate-500 mb-6">Saved packages you bookmarked. You can move them to cart anytime.</p>

        <WishlistList />
      </div>
    </div>
  );
}

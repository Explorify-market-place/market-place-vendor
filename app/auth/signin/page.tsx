// app/auth/signin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Sign in failed");
      }
      const data = await res.json();

      // *** DEMO / FALLBACK STORAGE (minimal change)
      // store token and vendor user so dashboard demo works without NextAuth cookies
      if (data?.token) {
        // demo token stored in localStorage; real backend should use httpOnly cookie/session
        localStorage.setItem("vendor_token", data.token);

        // store vendor user object too for demo fallback (used by dashboard)
        // vendor object from API should contain id and email at minimum.
        const vendorObj = data.vendor ?? { id: 1, email };
        try {
          localStorage.setItem("vendor_user", JSON.stringify(vendorObj));
        } catch {
          // ignore localStorage failures
        }

        if (remember) localStorage.setItem("vendor_remember", "1");
      }

      router.push("/vendor/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* left: benefits / hero */}
        <div className="hidden md:flex flex-col justify-center gap-6 p-8 rounded-2xl bg-gradient-to-b from-white/80 to-white/60 shadow">
          <h2 className="text-3xl font-extrabold">Grow your travel business</h2>
          <p className="text-slate-600">
            Join Explorify to list packages, increase visibility and get more bookings.
            Manage listings, view analytics, and reach global travelers.
          </p>

          <ul className="space-y-3 text-sm text-slate-700">
            <li>• Reach thousands of travelers</li>
            <li>• Easy package management</li>
            <li>• Simple payouts & reporting</li>
            <li>• Dedicated vendor support</li>
          </ul>

          <div className="mt-4 flex gap-3">
            <Link href="/vendor/benefits" className="px-4 py-2 bg-indigo-600 text-white rounded">Why Explorify</Link>
            <Link href="/auth/signup" className="px-4 py-2 border rounded">Create account</Link>
          </div>
        </div>

        {/* right: form */}
        <div className="bg-white rounded-2xl shadow p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-2">Vendor Sign In</h1>
          <p className="text-sm text-slate-500 mb-4">Sign in to manage your packages and dashboard.</p>

          {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className="w-full p-3 rounded-md border focus:ring-2 focus:ring-indigo-200"
                required
              />
            </label>

            <label className="block">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 rounded-md border focus:ring-2 focus:ring-indigo-200"
                required
              />
            </label>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4" />
                <span>Remember me</span>
              </label>
              <Link href="/vendor/forgot" className="text-sm text-indigo-600 hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 disabled:opacity-60 text-white rounded-md font-medium"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            New to Explorify? <Link href="/auth/signup" className="text-indigo-600 font-medium hover:underline">Create a vendor account</Link>
          </div>

          <div className="mt-6 border-t pt-4 text-xs text-slate-400">
            <div>Demo note: this is a frontend demo. Connect to your real auth API later.</div>
          </div>
        </div>
      </div>
    </main>
  );
}

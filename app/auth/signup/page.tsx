// app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorSignupPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || !company) {
      setError("Please fill required fields (company, email, password).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, name, phone, website, email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body?.message || "Signup failed");
      }
      // for demo, directly navigate to signin
      router.push("/auth/signin");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Create vendor account</h1>
        <p className="text-sm text-slate-500 mb-6">Quickly register your business to start listing packages.</p>

        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="Company / Business name *" className="p-3 border rounded" required />
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Contact name" className="p-3 border rounded" />
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone (optional)" className="p-3 border rounded" />
          <input value={website} onChange={(e)=>setWebsite(e.target.value)} placeholder="Website (optional)" className="p-3 border rounded" />
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email *" className="p-3 border rounded" required />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password *" className="p-3 border rounded" required />
          <div className="md:col-span-2 flex items-center gap-3">
            <input id="agree" type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
            <label htmlFor="agree" className="text-sm">I agree to Explorify's <Link href="/terms" className="text-indigo-600 hover:underline">terms</Link>.</label>
          </div>

          <div className="md:col-span-2 flex items-center justify-between mt-2">
            <button disabled={loading || !agree} className="px-5 py-3 bg-indigo-600 text-white rounded disabled:opacity-60">
              {loading ? "Creating…" : "Create account"}
            </button>
            <Link href="/auth/signin" className="text-sm text-indigo-600">Already registered? Sign in</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

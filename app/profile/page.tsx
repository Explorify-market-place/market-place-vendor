// app/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ProfileCard from "@/components/profile/ProfileCard";

/**
 * Profile page (client-side protected).
 *
 * Behavior:
 * - If session is loading -> show loader.
 * - If unauthenticated -> redirect to sign-in page.
 * - If authenticated -> show profile + edit & logout.
 *
 * Future-ready notes:
 * - Replace mockStats with API fetch to /api/vendor/me or similar.
 * - When backend is ready, fetch vendor details on mount and update UI.
 */

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      // you can use signIn() instead to open next-auth sign-in
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-500">Loading profile…</div>
      </div>
    );
  }

  // if no session we already redirected
  if (!session) return null;

  // ====== MOCK / STUB DATA (replace with real API later) ======
  // Example: call `/api/vendor/me` and set state; keep code shape consistent
  const mockStats = {
    packages: 12,
    bookings: 248,
    rating: 4.7,
  };

  const profile = {
    name: (session.user?.name as string) ?? "Vendor Name",
    email: session.user?.email ?? "vendor@example.com",
    avatar: null, // later assign real image URL from backend (session or API)
  };
  // ===========================================================

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 pb-12">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Your profile</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* left: profile card */}
          <div className="flex-1">
            <ProfileCard
              name={profile.name}
              email={profile.email}
              avatar={profile.avatar}
              stats={mockStats}
            />

            <div className="mt-6 space-y-4">
              <div className="bg-white dark:bg-slate-800 border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Business name</div>
                    <div className="font-medium">My Travel Co.</div>
                  </div>
                  <button className="text-sm text-indigo-600 hover:underline">Edit</button>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-slate-500">Location</div>
                  <div>Goa, India</div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-slate-500">Short bio</div>
                  <div>We run curated experiences across Goa and Kerala, focusing on family-friendly tours.</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Payout account</div>
                    <div className="font-medium">Not connected</div>
                  </div>
                  <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">Connect</button>
                </div>
                <div className="mt-4 text-sm text-slate-500">Add payout method to receive booking payouts.</div>
              </div>
            </div>
          </div>

          {/* right: quick actions & sign out */}
          <div className="md:w-96">
            <div className="bg-white dark:bg-slate-800 border rounded-2xl p-6 shadow-sm sticky top-28">
              <div className="text-sm text-slate-500">Signed in as</div>
              <div className="font-medium">{profile.email}</div>

              <div className="mt-6 space-y-3">
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
                  onClick={() => router.push("/vendor/dashboard")}
                >
                  Go to Dashboard
                </button>

                <button
                  className="w-full border rounded-md py-2"
                  onClick={() => router.push("/vendor/packages")}
                >
                  Manage packages
                </button>

                <button
                  className="w-full text-left text-sm text-slate-600 hover:underline"
                  onClick={() => router.push("/vendor/bookings")}
                >
                  View bookings
                </button>

                <div className="pt-3 border-t mt-3">
                  <button
                    className="w-full text-red-600 border border-red-600 rounded-md py-2"
                    onClick={() => {
                      // sign out
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            {/* Future widgets: small analytics, quick stats */}
            <div className="mt-4 space-y-4">
              <div className="bg-white dark:bg-slate-800 border rounded-2xl p-4 shadow-sm">
                <div className="text-sm text-slate-500">Quick metrics</div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Conversion</div>
                    <div className="font-semibold">6.2%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Avg. rating</div>
                    <div className="font-semibold">4.7</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 border rounded-2xl p-4 shadow-sm">
                <div className="text-sm text-slate-500">Support</div>
                <div className="mt-2 text-sm">
                  Need help? Email <a href="mailto:support@explorify.example" className="text-indigo-600">support@explorify.example</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* container end */}
    </div>
  );
}

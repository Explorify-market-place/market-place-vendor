// components/profile/ProfileCard.tsx
"use client";
import React from "react";

type Props = {
  name: string;
  email: string;
  avatar?: string | null;
  stats?: { packages?: number; bookings?: number; rating?: number };
};

export default function ProfileCard({ name, email, avatar, stats }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 border rounded-2xl shadow-sm p-6 w-full md:w-[520px]">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
          {avatar ? (
            // real image
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} className="object-cover w-full h-full" />
          ) : (
            (name || "U").slice(0, 1).toUpperCase()
          )}
        </div>

        <div>
          <div className="text-xl font-extrabold">{name}</div>
          <div className="text-sm text-slate-500 dark:text-slate-300">{email}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-slate-500">Packages</div>
          <div className="text-lg font-semibold">{stats?.packages ?? 0}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500">Bookings</div>
          <div className="text-lg font-semibold">{stats?.bookings ?? 0}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500">Rating</div>
          <div className="text-lg font-semibold">{(stats?.rating ?? 0).toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

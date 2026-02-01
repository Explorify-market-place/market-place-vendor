"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Settings,
  LogOut,
  HelpCircle,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  Shield,
  LayoutDashboard,
  Ticket,
  BarChart,
} from "lucide-react";
import { useTheme } from "next-themes";

interface ProfileMenuProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    vendorVerified?: boolean;
  };
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Vendor menu items
  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/bookings", label: "Bookings", icon: Ticket },
    { href: "/analytics", label: "Analytics", icon: BarChart },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
      >
        <div className="relative">
          {/* Notification Dot */}
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-950" />

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all duration-200">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "Profile"}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>

        {/* Name (hidden on mobile) */}
        <span className="hidden md:block text-sm font-medium max-w-[100px] truncate text-slate-700 dark:text-slate-200">
          {user?.name?.split(" ")[0] || "User"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
            {/* User Info Header */}
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-linear-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/20 dark:ring-blue-500/10">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Profile"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                  {user?.role !== "user" && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Shield className="w-3 h-3" />
                      {user?.role === "admin" ? "Admin" : "Vendor"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-2 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-600 dark:text-slate-300">
                  <Bell className="w-4 h-4" />
                  <span className="text-xs">Notifications</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-600 dark:text-slate-300"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  <span className="text-xs">
                    {theme === "dark" ? "Light" : "Dark"}
                  </span>
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Main Navigation Items */}
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                    <span className="flex-1 text-sm">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}

              {/* Settings */}
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                <span className="flex-1 text-sm">Settings</span>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Help */}
              <Link
                href="/help"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                onClick={() => setIsOpen(false)}
              >
                <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                <span className="flex-1 text-sm">Help & Support</span>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Sign Out */}
            <div className="p-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group text-slate-600 dark:text-slate-300"
              >
                <LogOut className="w-4 h-4 group-hover:text-red-600 dark:group-hover:text-red-400" />
                <span className="flex-1 text-left text-sm">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

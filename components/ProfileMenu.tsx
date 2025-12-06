"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  CreditCard, 
  HelpCircle,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  Shield,
  Briefcase,
  LayoutDashboard,
  Package,
  BarChart
} from "lucide-react";
import { useTheme } from "next-themes";

interface ProfileMenuProps {
  user: any;
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

  // Role-specific menu items
  const getRoleSpecificItems = () => {
    switch (user?.role) {
      case "vendor":
        return [
          { href: "/vendor/dashboard", label: "Vendor Dashboard", icon: LayoutDashboard },
          { href: "/vendor/trips", label: "Manage Packages", icon: Package },
          { href: "/vendor/analytics", label: "Analytics", icon: BarChart },
        ];
      case "admin":
        return [
          { href: "/admin/dashboard", label: "Admin Dashboard", icon: Shield },
          { href: "/admin/users", label: "Manage Users", icon: User },
          { href: "/admin/vendors", label: "Manage Vendors", icon: Briefcase },
        ];
      default:
        return [
          { href: "/profile/trips", label: "My Trips", icon: Package },
          { href: "/profile/saved", label: "Saved", icon: Heart },
          { href: "/profile/payments", label: "Payment Methods", icon: CreditCard },
        ];
    }
  };

  const roleSpecificItems = getRoleSpecificItems();

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 p-1.5 rounded-full hover:bg-accent/50 transition-all duration-200 group"
      >
        <div className="relative">
          {/* Notification Dot */}
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-200">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "Profile"}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
        
        {/* Name (hidden on mobile) */}
        <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
          {user?.name?.split(" ")[0] || "User"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="rounded-2xl overflow-hidden bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl">
            {/* User Info Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Profile"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  {user?.role !== "user" && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <Shield className="w-3 h-3" />
                      {user?.role === "admin" ? "Admin" : "Vendor"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200">
                  <Bell className="w-4 h-4" />
                  <span className="text-xs">Notifications</span>
                  <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs font-medium">3</span>
                </button>
                <button 
                  onClick={toggleTheme}
                  className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-xs">{theme === "dark" ? "Light" : "Dark"}</span>
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Profile Link */}
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                <span className="flex-1 text-sm">My Profile</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Role Specific Items */}
              {roleSpecificItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    <span className="flex-1 text-sm">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}

              {/* Settings */}
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                <span className="flex-1 text-sm">Settings</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Help */}
              <Link
                href="/help"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                onClick={() => setIsOpen(false)}
              >
                <HelpCircle className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                <span className="flex-1 text-sm">Help & Support</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Sign Out */}
            <div className="p-2 border-t border-border/50">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4" />
                <span className="flex-1 text-left text-sm">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
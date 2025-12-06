"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Button } from "../../ui/button";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ProfileMenu from "../../ProfileMenu";
import {
  LayoutDashboard,
  Package,
  Ticket,
  BarChart3,
  Settings,
  AlertCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/packages", label: "My Packages", icon: Package },
    { href: "/bookings", label: "Bookings", icon: Ticket },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const isVerified = session?.user?.vendorVerified;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300">
      <div
        className={`
          mx-auto max-w-7xl rounded-full transition-all duration-500
          ${
            scrolled
              ? "backdrop-blur-xl bg-background/60 shadow-2xl border border-border/40"
              : "backdrop-blur-lg bg-background/40 shadow-lg border border-border/20"
          }
        `}
      >
        <div className="px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:scale-105 transition-transform duration-200 shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vendor Portal
            </span>
          </Link>

          {/* Center Navigation */}
          {session && (
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                      transition-all duration-200 hover:scale-105
                      ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Verification Status Badge */}
            {session && !isVerified && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-500">
                  Pending Verification
                </span>
              </div>
            )}

            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <ProfileMenu user={session.user} />
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    Vendor Sign In
                  </Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      {session && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/40 px-4 py-2 z-50">
          <nav className="flex items-center justify-around">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}

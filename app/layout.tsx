import "./globals.css";

import Navbar from "@/components/common/nav/Navbar";
import Footer from "@/components/common/Footer";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "next-themes";
import { Plus_Jakarta_Sans } from "next/font/google";

/* ===============================
   GOOGLE FONT CONFIG
   =============================== */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

/* ===============================
   ROOT LAYOUT
   =============================== */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <head>
        {/* Material Symbols Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional"
          rel="stylesheet"
        />
      </head>

      <body
        className="
          font-display
          antialiased
          bg-background
          text-foreground
        "
      >
        <AuthProvider>
          {/* FORCE LIGHT MODE for Landing Page */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

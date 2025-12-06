"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Star,
  Shield,
  Zap,
  Users,
  Globe,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const vendorParam = searchParams.get("vendor");
  const isVendor = vendorParam === "1" || vendorParam === "true";

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authMethod, setAuthMethod] = useState<"oauth" | "email">("oauth");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const features = [
    { icon: Shield, text: "Secure Booking" },
    { icon: Zap, text: "Instant Confirmation" },
    { icon: Users, text: "24/7 Support" },
    { icon: Globe, text: "Global Destinations" },
  ];

  const benefits = isVendor
    ? [
        "Zero commission fees for first month",
        "Advanced analytics dashboard",
        "Marketing tools and promotion",
        "24/7 dedicated vendor support",
        "Global customer reach",
      ]
    : [
        "Best price guarantee",
        "Instant booking confirmation",
        "24/7 customer support",
        "Flexible cancellation policy",
        "Verified tour operators",
      ];

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to sign in with Google");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: isVendor ? "vendor" : "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (authMode === "signin") {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
        } else if (result?.url) {
          router.push(result.url);
        }
      } else {
        // Handle signup
        await handleSignUp(formData.email, formData.password, formData.name);

        setSuccess("Account created successfully! Please sign in to continue.");
        setAuthMode("signin");
        setFormData({ name: "", email: formData.email, password: "" });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Auth Form */}
          <div className="relative max-w-md mx-auto lg:mx-0">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-60" />

            {/* Main Card */}
            <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {isVendor ? "Vendor Portal" : "Welcome Back"}
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-down">
                {isVendor ? (
                  <>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Become a
                    </span>
                    <br />
                    <span className="text-foreground">Vendor</span>
                  </>
                ) : (
                  <>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {authMode === "signin" ? "Sign in to" : "Join"}
                    </span>
                    <br />
                    <span className="text-foreground">Explorify</span>
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
                {isVendor
                  ? "Join our platform and start offering amazing travel experiences to millions of travelers worldwide."
                  : authMode === "signin"
                  ? "Continue your journey and explore incredible destinations around the world."
                  : "Create an account and start exploring amazing travel experiences."}
              </p>

              {/* Auth Method Toggle */}
              {authMethod === "oauth" ? (
                <>
                  {/* Google Sign In Button */}
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    size="lg"
                    className="w-full rounded-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 mb-6 animate-scale-in"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Continue with Google
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background/60 px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  {/* Email Sign In Button */}
                  <Button
                    onClick={() => setAuthMethod("email")}
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full py-6 text-lg hover:bg-accent/50 transition-all duration-200 mb-6"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Continue with Email
                  </Button>
                </>
              ) : (
                <>
                  {/* Email/Password Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                    {/* Success Message */}
                    {success && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
                        {success}
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {error}
                      </div>
                    )}

                    {/* Name Field (Sign Up Only) */}
                    {authMode === "signup" && (
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required={authMode === "signup"}
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/70 transition-all duration-200"
                        />
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/70 transition-all duration-200"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        minLength={authMode === "signup" ? 6 : undefined}
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/70 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements (Sign Up Only) */}
                    {authMode === "signup" && (
                      <div className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full rounded-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          {authMode === "signin"
                            ? "Signing in..."
                            : "Creating account..."}
                        </>
                      ) : (
                        <>
                          {authMode === "signin" ? "Sign In" : "Create Account"}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Toggle Sign In / Sign Up */}
                  <div className="text-center mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode(
                          authMode === "signin" ? "signup" : "signin"
                        );
                        setError("");
                        setSuccess("");
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {authMode === "signin"
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                    </button>
                  </div>

                  {/* Back to OAuth */}
                  <Button
                    onClick={() => {
                      setAuthMethod("oauth");
                      setError("");
                      setSuccess("");
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full rounded-full"
                  >
                    Back to other options
                  </Button>
                </>
              )}

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-xl bg-accent/50 border border-border/30 hover:border-primary/30 transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Secure authentication powered by Google</span>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="hidden lg:block space-y-6 animate-fade-in">
            {/* Stats Card */}
            <div className="bg-background/40 backdrop-blur-lg border border-border/30 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-6">
                {isVendor ? "Why Vendors Love Us" : "Why Travelers Choose Us"}
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-foreground font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-background/40 backdrop-blur-lg border border-border/30 rounded-2xl p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">
                {isVendor
                  ? "Explorify helped me grow my tour business beyond my wildest dreams. The platform is intuitive and the support team is phenomenal!"
                  : "Best travel platform I've ever used! Found amazing hidden gems and the booking process was seamless. Highly recommended!"}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {isVendor ? "SC" : "JD"}
                </div>
                <div>
                  <div className="font-semibold">
                    {isVendor ? "Sarah Chen" : "John Doe"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isVendor ? "Tour Operator" : "Travel Enthusiast"}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {(isVendor
                ? [
                    { value: "20+", label: "Vendors" },
                    { value: "50+", label: "Travelers" },
                    { value: "90%", label: "Satisfaction" },
                  ]
                : [
                    { value: "100+", label: "Destinations" },
                    { value: "50+", label: "Travelers" },
                    { value: "4.9★", label: "Rating" },
                  ]
              ).map((stat, index) => (
                <div
                  key={index}
                  className="bg-background/40 backdrop-blur-lg border border-border/30 rounded-xl p-4 text-center hover:scale-105 transition-all duration-200"
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

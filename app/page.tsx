<<<<<<< HEAD
// app/page.tsx

"use client"
import { useMemo, useState } from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Hero from "@/components/landing/Hero";
import TopTabs from "@/components/landing/TopTabs";
import MorePackages from "@/components/landing/MorePackages";
import Reviews from "@/components/landing/Reviews";
import { samplePackages } from "@/lib/mockPackages";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return samplePackages;
    return samplePackages.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.days && p.days.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  return (
    <>
      <Header />

      <main>
        {/* pass onSearch so hero search updates page-level filter */}
        <Hero onSearch={(q) => setSearchQuery(q)} />

        {/* removed the duplicate floating search here (was previously under Hero) */}

        <TopTabs items={filtered} />
        <MorePackages items={filtered} />
        <Reviews />
      </main>

      <Footer />
    </>
  );
}
=======
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  Globe,
  Shield,
  DollarSign,
  BarChart3,
  CheckCircle2,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Trophy,
  Clock,
  HeartHandshake,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function VendorLandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };

  const stats = [
    { value: "20+", label: "Active Vendors", icon: Users },
    { value: "500+", label: "Happy Travelers", icon: Globe },
    { value: "95%", label: "Satisfaction Rate", icon: Star },
    { value: "10+", label: "Countries", icon: TrendingUp },
  ];

  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connect with travelers from around the world looking for authentic experiences.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: DollarSign,
      title: "Competitive Earnings",
      description:
        "Keep 85% of your earnings with our fair commission structure.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Safe and secure payment processing with fraud protection.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your performance with detailed insights and reports.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Instant Bookings",
      description:
        "Receive real-time notifications and manage bookings efficiently.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: HeartHandshake,
      title: "Dedicated Support",
      description: "24/7 vendor support to help you grow your business.",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const benefits = [
    "No upfront costs or hidden fees",
    "Free marketing and promotion",
    "Easy-to-use dashboard",
    "Flexible pricing control",
    "Verified customer reviews",
    "Instant payment processing",
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      role: "Adventure Tour Operator",
      content:
        "Joining Explorify was the best decision for my business. I've tripled my bookings in just 3 months!",
      rating: 5,
      image: "MS",
      location: "Philippines",
    },
    {
      name: "John Anderson",
      role: "Cultural Experience Host",
      content:
        "The platform is incredibly easy to use, and the support team is always there when I need help.",
      rating: 5,
      image: "JA",
      location: "Thailand",
    },
    {
      name: "Yuki Tanaka",
      role: "Nature Guide",
      content:
        "I love how I can manage everything from one place. The analytics help me understand my customers better.",
      rating: 5,
      image: "YT",
      location: "Japan",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your vendor account in minutes",
    },
    {
      number: "02",
      title: "Create Packages",
      description: "List your unique travel experiences",
    },
    {
      number: "03",
      title: "Get Verified",
      description: "Our team reviews and approves your profile",
    },
    {
      number: "04",
      title: "Start Earning",
      description: "Receive bookings and grow your business",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Join {stats[0].value} successful vendors
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-down">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Grow Your Travel
            </span>
            <br />
            <span className="text-foreground">Business Online</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in">
            Partner with Explorify to reach thousands of travelers worldwide.
            List your unique experiences and start earning today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              {session ? "Go to Dashboard" : "Start Selling Today"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-lg hover:bg-accent/50 transition-all duration-200"
            >
              Watch How It Works
            </Button>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Explorify?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to succeed as a travel vendor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative group cursor-pointer"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300`}
                  />
                  <div className="relative h-full bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Start selling in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Vendor Benefits
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything included, no hidden costs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-background/60 backdrop-blur-xl border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-all duration-300"
              >
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              Hear from our thriving vendor community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-lg mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-border/50 rounded-3xl p-12">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Earning?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of successful vendors and turn your passion
              into profit.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              {session ? "Go to Dashboard" : "Create Vendor Account"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">Start in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1

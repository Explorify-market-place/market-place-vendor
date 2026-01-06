"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const goStart = () => {
    router.push(session ? "/dashboard" : "/auth/sign-in");
  };

  return (
    <main className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* ================= HEADER ================= */}
      {/* <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              ET
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
  Explorify Trips
</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a>Start</a>
            <a>Grow</a>
            <a>Fees & Commission</a>
            <a>Resources</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={goStart} className="text-sm font-semibold">Login</button>
            <button
              onClick={goStart}
              className="bg-primary text-white dark:text-slate-400 px-6 py-2 rounded-lg font-bold"
            >
              Start Selling
            </button>
          </div>
        </div>
      </header> */}

 {/* ================= HERO SECTION ================= */}
<section className="relative pt-24 pb-32 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">

    {/* ================= LEFT CONTENT ================= */}
    <div className="space-y-6 text-center lg:text-left">
      <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.15] text-slate-900 dark:text-slate-100">
        Start Selling{" "}
        <span className="text-[#1d4ed8]">Travel Packages</span> Today
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
        List your customized travel packages in front of thousands of
        ready-to-book customers across India. Join the fastest-growing B2B
        travel network.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
        <button
          onClick={goStart}
          className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition flex items-center gap-2"
        >
          Start Selling <span>→</span>
        </button>

        <button className="border border-slate-300 hover:bg-slate-100 px-8 py-3 rounded-xl font-semibold transition">
          Talk to Vendor Support
        </button>
      </div>
    </div>

    {/* ================= RIGHT IMAGE + FLOATING CARDS ================= */}
    <div className="relative w-full aspect-[4/3] lg:aspect-square max-h-[600px]">

      {/* Soft Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-full -z-10" />

      {/* Main Image */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border bg-white">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK24U03f3qWCszFzno1P63U4pvK7OcR4g5pkBzlXwZifdcP-QYljMvYFSGNkKsbCJ8h3su_wrPdvNS62fkM7QARc1-FCkVsyVwQlyo8EgPdOt9SUAQ5mxxoBOFrJlXOyXmV-J-RbyVtebLtnt-k8ERpx2rJOjUF-2m-_l0rhZLSe-WzSq1TlbNpluETrnin5lLFQjCa-RrzIHVQm-1FiFfutzjBROi30cgWDfRa3z2FMPSn1w7ZjGe2PR-P58JOlfZOfM8Ra60hSOa"
          alt="Vendor working on dashboard"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ================= FLOATING CARD: TOTAL SALES ================= */}
      <div className="absolute top-6 right-6 bg-white p-4 rounded-xl shadow-lg border w-52">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            📈
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Sales</p>
            <p className="text-sm font-bold text-slate-900">₹12,45,000</p>
          </div>
        </div>
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 w-[75%]" />
        </div>
      </div>

      {/* ================= FLOATING CARD: PACKAGE LIVE ================= */}
      <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg border max-w-[220px]">
        <div className="flex gap-3">
          <div
            className="w-12 h-12 rounded-lg bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHySsN_x1UhvRH1mSp26InHjQbddj91roRQw8NxlaM957cz7BV7-8fB3vWioN3I0ieMUQfHHs9dZGsRtVIi6sUX7tAr9vuF9iMXTTvsu6c729VPwP6HBZzd1UD5LPwINbnBajEIKqFicABAOnk_BqsIlU7uZ0I6S-mAO3vA8g3N_siA3_-BUNKKe7JbgZlK9R9TqYLqTLiQz6o_vo9UA8UGagY996GlD679cc00mb8_TfYDpdDRhTBvbJpaVIHuhx776lAWbVue3hF')",
            }}
          />
          <div>
            <p className="text-sm font-bold text-slate-900">
              Manali Adventure
            </p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              ✔ Published Live
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>



{/* ================= STATS ================= */}
<section className="bg-slate-50 dark:bg-slate-900 py-20">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10 text-center">

    {/* Verified Vendors */}
    <div className="space-y-3">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
        <span className="material-symbols-outlined text-3xl">
          verified
        </span>
      </div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">1,000+</div>
      <div className="text-sm text-slate-600">Verified Vendors</div>
    </div>

    {/* Monthly Travelers */}
    <div className="space-y-3">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
        <span className="material-symbols-outlined text-3xl">
          groups
        </span>
      </div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">50,000+</div>
      <div className="text-sm text-slate-600">Monthly Travelers</div>
    </div>

    {/* PAN India */}
    <div className="space-y-3">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
        <span className="material-symbols-outlined text-3xl">
          public
        </span>
      </div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">PAN-India</div>
      <div className="text-sm text-slate-600">Active Reach</div>
    </div>

    {/* Weekly Payouts */}
    <div className="space-y-3">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
        <span className="material-symbols-outlined text-3xl">
          lock
        </span>
      </div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Secure</div>
      <div className="text-sm text-slate-600">Weekly Payouts</div>
    </div>

    {/* Support */}
    <div className="space-y-3">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
        <span className="material-symbols-outlined text-3xl">
          support_agent
        </span>
      </div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">24/7</div>
      <div className="text-sm text-slate-600">Dedicated Support</div>
    </div>

  </div>
</section>
{/* ================= MANAGE BUSINESS ================= */}
<section className="py-28">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT CONTENT */}
    <div>
      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
        Manage Your Travel Business <br /> Anytime, Anywhere
      </h2>

      <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl">
        Our powerful vendor dashboard gives you complete control over your
        inventory and bookings. No technical skills required.
      </p>

      <div className="mt-10 space-y-8">

        {/* ITEM 1 */}
        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            📦
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-400">
              Add & Manage Packages
            </h4>
            <p className="text-slate-600 mt-1">
              Easily create detailed itineraries, set pricing, and manage
              availability slots.
            </p>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            📊
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-400">
              Track Bookings & Payouts
            </h4>
            <p className="text-slate-600 mt-1">
              Real-time analytics on your sales performance and automated
              payment tracking.
            </p>
          </div>
        </div>

        {/* ITEM 3 */}
        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            💬
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-400">
              Communicate with Customers
            </h4>
            <p className="text-slate-600 mt-1">
              Built-in chat system to answer pre-booking queries and manage
              guest requirements.
            </p>
          </div>
        </div>

      </div>
    </div>

    {/* RIGHT DASHBOARD MOCK */}
    <div className="relative">
      <div className="rounded-2xl border shadow-xl bg-white overflow-hidden">

        {/* Browser Top Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <span className="w-3 h-3 bg-red-400 rounded-full" />
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          <span className="w-3 h-3 bg-green-400 rounded-full" />
        </div>

        {/* Dashboard Content */}
        <div className="p-6 grid grid-cols-5 gap-6">

          {/* SIDEBAR */}
          <div className="col-span-2 space-y-4">
            <div className="h-10 bg-slate-200 rounded-lg" />
            <div className="h-10 bg-slate-200 rounded-lg" />
            <div className="h-10 bg-slate-200 rounded-lg" />
            <div className="h-10 bg-slate-200 rounded-lg" />
          </div>

          {/* MAIN CONTENT */}
          <div className="col-span-3 bg-slate-50 rounded-xl p-5">
            <div className="flex items-end gap-3 h-32">
              <div className="w-10 bg-blue-200 rounded-t-lg h-16" />
              <div className="w-10 bg-blue-300 rounded-t-lg h-24" />
              <div className="w-10 bg-blue-200 rounded-t-lg h-20" />
              <div className="w-10 bg-blue-500 rounded-t-lg h-28" />
              <div className="w-10 bg-blue-400 rounded-t-lg h-22" />
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</section>

{/* ================= STEPS ================= */}
<section className="bg-slate-50 dark:bg-slate-900 py-24">
  <div className="max-w-7xl mx-auto px-6 text-center">

    {/* Heading */}
    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-400">
      Start Selling Travel Packages in 4 Simple Steps
    </h2>
    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
      Streamlined process to get your business live on our platform.
    </p>

    {/* Steps */}
    <div className="mt-16 grid md:grid-cols-4 gap-14">

      {/* STEP 1 */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-400">
          1. Register
        </h3>
        <p className="mt-3 text-slate-600">
          Create your vendor account with basic business details and GST info.
        </p>
      </div>

      {/* STEP 2 */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
          <span className="text-2xl">🛡️</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-400">
          2. Get Verified
        </h3>
        <p className="mt-3 text-slate-600">
           Our team reviews your listing for quality assurance within 24 hours.
        </p>
      </div>

      {/* STEP 3 */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
          <span className="text-2xl">🖼️</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-400">
          3. Add Packages  
        </h3>
        <p className="mt-3 text-slate-600">
          Upload your itinerary, photos, and set competitive pricing.
        </p>
      </div>

      {/* STEP 4 */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
          <span className="text-2xl dark:text-slate-400">₹</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-400">
          4. Start Earning
        </h3>
        <p className="mt-3 text-slate-600">
          Go live and receive bookings directly to your dashboard.
        </p>
      </div>

    </div>
  </div>
</section>


{/* ================= RESOURCES ================= */}
<section className="py-24 bg-white dark:bg-slate-950 ">
  <div className="max-w-7xl mx-auto px-6 ">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-14 ">
      <div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-400">
          Vendor Resources
        </h2>
        <p className="text-slate-600 mt-2 dark:text-slate-400">
          Guides and insights to help you grow.
        </p>
      </div>

      <button className="text-blue-600 font-semibold hover:underline dark:text-blue-400">
        View All Resources →
      </button>
    </div>

    {/* Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          tag: "GUIDE",
          title: "How to price travel packages competitively",
          img: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=1200",
        },
        {
          tag: "BLOG",
          title: "How top vendors increase bookings by 40%",
          img: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?q=80&w=1200",
        },
        {
          tag: "POLICY",
          title: "2024 Commission & Payout Structure Guide",
          img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200",
        },
        {
          tag: "UPDATE",
          title: "Seasonal Demand Insights: Winter 2024",
          img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200",
        },
      ].map((item) => (
        <div
          key={item.title}
          className="group rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition"
        >
          {/* Image */}
          <div className="h-48 overflow-hidden">
            <img
              src={item.img}
              alt={item.title}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-xs font-bold text-blue-600 tracking-wide mb-2">
              {item.tag}
            </p>
            <h3 className="text-lg font-semibold text-slate-900 leading-snug">
              {item.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ================= CTA ================= */}
<section className="bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 from-slate-50 to-slate-100 py-24 text-center">
  <div className="max-w-3xl mx-auto px-6">
    <div className="text-yellow-400 text-4xl mb-4">⚡</div>
    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-400">
     "Over 60% of new vendors receive their first booking within 30 days of listing."
    </h2>

    <button
      onClick={goStart}
      className="mt-10 bg-white text-slate-900  px-10 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition"
    >
      Join the Success Story
    </button>
  </div>
</section>

{/* ================= TESTIMONIALS ================= */}
<section className="bg-slate-50 dark:bg-slate-900 py-24">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-extrabold text-center text-slate-900 dark:text-slate-400">
      Trusted by India&apos;s Best Travel Operators
    </h2>

    <div className="mt-16 grid md:grid-cols-3 gap-10">
      {[
        {
          text: "We scaled our travel business 3× after joining this platform. The dashboard makes managing itineraries so simple.",
          name: "Rajesh Kumar",
          org: "Himalayan Treks, Manali",
          img: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
          text: "The support team is incredible. They helped me optimize my pricing strategy which boosted my off-season occupancy.",
          name: "Anita Desai",
          org: "Goa Vibes Travels, Goa",
          img: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          text: "Secure payments and transparent policies. It’s the most trustworthy B2B platform I’ve used in 10 years.",
          name: "Vikram Singh",
          org: "Rajasthan Royal Tours, Jaipur",
          img: "https://randomuser.me/api/portraits/men/76.jpg",
        },
      ].map((t) => (
        <div
          key={t.name}
          className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
        >
          {/* ⭐ Stars */}
          <div className="flex gap-1 text-yellow-400 mb-4 text-lg">
            ★★★★★
          </div>

          {/* 💬 Quote */}
          <p className="text-slate-600 italic leading-relaxed">
            “{t.text}”
          </p>

          {/* 👤 Profile */}
          <div className="flex items-center gap-4 mt-8">
            <img
              src={t.img}
              alt={t.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-slate-900">
                {t.name}
              </p>
              <p className="text-sm text-slate-500">
                {t.org}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


{/* ================= GROW BRAND ================= */}
<section className="py-24">
  <div className="max-w-3xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-400">
      From Local Travel Operator to Pan-India Brand
    </h2>
    <p className="mt-4 text-lg text-slate-600">
      Join our trusted vendor network and grow your travel business digitally.
      No hidden listing fees.
    </p>

    <button
      onClick={goStart}
      className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold shadow-lg transition"
    >
      Start Selling Travel Packages
    </button>
  </div>
</section>


     
    </main>
  );
}

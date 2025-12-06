// components/landing/Carousel.tsx
"use client";
import { useRef, useEffect, useState } from "react";

export default function Carousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const update = () => {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const el = ref.current!;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      el.classList.add("cursor-grabbing");
      startX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : (e as MouseEvent).pageX;
      scrollLeft = el.scrollLeft;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      const x = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].pageX : (e as MouseEvent).pageX;
      const walk = (startX - x);
      el.scrollLeft = scrollLeft + walk;
    };
    const onUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const scrollBy = (dir: "left" | "right") => {
    const el = ref.current!;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  // keyboard arrows
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollBy("left");
      if (e.key === "ArrowRight") scrollBy("right");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-20">
        <button onClick={() => scrollBy("left")} disabled={!canScrollLeft} className={`w-10 h-10 rounded-full bg-white shadow ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : ""}`}>
          <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 6L9 12l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="overflow-x-auto no-scrollbar" ref={ref} style={{ scrollBehavior: "smooth" }}>
        <div className="flex gap-6 py-2 px-6">
          {children}
        </div>
      </div>

      <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20">
        <button onClick={() => scrollBy("right")} disabled={!canScrollRight} className={`w-10 h-10 rounded-full bg-white shadow ${!canScrollRight ? "opacity-30 cursor-not-allowed" : ""}`}>
          <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

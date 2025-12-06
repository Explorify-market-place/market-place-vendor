// components/landing/Reviews.tsx
"use client";

import { useEffect, useState, useRef } from "react";

type Review = {
  id: number;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  photos?: string[]; // data URLs or remote URLs
  date?: string;
  metric?: string; // vendor metric text like "↑ 48% bookings"
};

const STORAGE_KEY = "explorify_reviews_v1";

// small placeholder image (inline data URL, tiny gray image)
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' fill='#9ca3af' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle'>no image</text></svg>`
);

const initial: Review[] = [
  {
    id: 1,
    name: "Anita K.",
    rating: 5,
    text: "Joined Explorify last season — we saw a 48% increase in direct bookings within 2 months. Excellent support!",
    avatar: "https://i.pravatar.cc/80?img=32",
    photos: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop"
    ],
    date: new Date().toISOString(),
    metric: "↑ 48% bookings",
  },
  {
    id: 2,
    name: "Sanjay P.",
    rating: 4,
    text: "Our package became visible to thousands more users and daily leads doubled. Solid onboarding process.",
    avatar: "https://i.pravatar.cc/80?img=12",
    photos: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop"
    ],
    date: new Date().toISOString(),
    metric: "↑ 100% leads",
  },
  {
    id: 3,
    name: "Maya R.",
    rating: 5,
    text: "Listings performed great during peak season — high conversion and better reviews from customers.",
    avatar: "https://i.pravatar.cc/80?img=44",
    photos: [
      "https://images.unsplash.com/photo-1506976785307-8732e854ad5b?q=80&w=800&auto=format&fit=crop"
    ],
    date: new Date().toISOString(),
    metric: "↑ 35% traffic",
  },
];

function Star({ filled }: { filled: boolean }) {
  return (
    <svg className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-slate-300"}`} viewBox="0 0 24 24" aria-hidden fill={filled ? "currentColor" : "none"} stroke="currentColor">
      <path d="M12 17.3 7.2 20l.9-5.2L4 11.5l5.3-.7L12 6l2.7 4.8 5.3.7-4.1 3.3.9 5.2z" />
    </svg>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [metricValue, setMetricValue] = useState<number | "">("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [modalSrc, setModalSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setReviews(JSON.parse(raw));
      else setReviews(initial);
    } catch {
      setReviews(initial);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const avg = (reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0).toFixed(1);

  // Convert selected files to data URLs and append (max 3)
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fl = e.target.files;
    if (!fl || fl.length === 0) return;
    const arr = Array.from(fl).slice(0, 3);
    const readers = arr.map((f) => {
      return new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(String(reader.result));
        reader.onerror = () => rej();
        reader.readAsDataURL(f);
      });
    });

    Promise.all(readers)
      .then((dataUrls) => {
        setFiles((s) => {
          const merged = [...s, ...dataUrls];
          return merged.slice(0, 3);
        });
      })
      .catch(() => alert("Failed to read one of the files. Try different images."));

    e.currentTarget.value = "";
  };

  const addReview = () => {
    if (!name.trim() || !text.trim()) {
      alert("Please enter your name and a review.");
      return;
    }
    const metricText = metricValue ? `↑ ${metricValue}% bookings` : undefined;
    const newReview: Review = {
      id: Date.now(),
      name: name.trim(),
      rating,
      text: text.trim(),
      avatar: `https://i.pravatar.cc/80?u=${Math.random().toString(36).slice(2)}`,
      photos: files.slice(),
      date: new Date().toISOString(),
      metric: metricText,
    };
    setReviews((r) => [newReview, ...r]);
    // clear
    setName("");
    setText("");
    setRating(5);
    setFiles([]);
    setMetricValue("");
    if (fileRef.current) fileRef.current.value = "";
  };

  // helper to ensure we render only valid image src (if falsy, show placeholder)
  const safeImage = (src?: string) => {
    if (!src) return PLACEHOLDER;
    // small heuristic: if src starts with data: or http/https, use it, otherwise fallback
    if (src.startsWith("data:") || src.startsWith("http") || src.startsWith("https")) return src;
    return PLACEHOLDER;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-extrabold">Vendor success stories</h3>
          <div className="mt-2 text-slate-600 flex items-center justify-center gap-4">
            <div className="text-2xl font-bold text-indigo-600">{avg} <span className="text-base text-slate-400">/ 5</span></div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} filled={i < Math.round(Number(avg))} />
              ))}
            </div>
            <div className="text-sm text-slate-500 ml-3">Based on {reviews.length} vendor reviews</div>
          </div>
        </div>

        {/* Centered form */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-slate-50 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Share your vendor success</div>
              <div className="text-xs text-slate-500">How did Explorify impact bookings/traffic?</div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-md p-3" />

              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-600">Rating:</div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setRating(i + 1)} className="p-1" aria-label={`Rate ${i + 1}`}>
                      <Star filled={i < rating} />
                    </button>
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <label className="text-sm text-slate-600">Metric %</label>
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    value={metricValue as any}
                    onChange={(e) => setMetricValue(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 48"
                    className="w-20 p-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              <textarea placeholder="Write how Explorify impacted your business (increase in traffic, bookings, visibility)" value={text} onChange={(e) => setText(e.target.value)} className="w-full border rounded-md p-3" rows={4} />

              <div>
                <label className="text-sm text-slate-600">Upload photos (optional, max 3)</label>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFile} className="mt-2" />
                <div className="flex gap-2 mt-3">
                  {files.length === 0 && <div className="text-sm text-slate-400">No photos selected</div>}
                  {files.map((f, idx) => (
                    <button key={idx} type="button" className="w-20 h-20 rounded-md overflow-hidden border" onClick={() => setModalSrc(f)}>
                      <img src={safeImage(f)} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button onClick={addReview} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Submit</button>
                <button onClick={() => { setName(""); setText(""); setRating(5); setFiles([]); setMetricValue(""); if (fileRef.current) fileRef.current.value = ""; }} className="px-4 py-2 border rounded-md">Clear</button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <article key={r.id} className="bg-slate-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <img src={safeImage(r.avatar)} alt={r.name} className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-xs text-slate-500">{new Date(r.date || "").toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-indigo-600 font-semibold">{r.metric ?? ""}</div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} filled={i < r.rating} />)}
                    </div>
                    <div className="text-sm text-slate-500 ml-2">{r.rating}.0</div>
                  </div>

                  <p className="mt-3 text-slate-700">{r.text}</p>

                  {r.photos && r.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {r.photos.map((p, idx) => (
                        <button key={idx} onClick={() => setModalSrc(p)} className="h-20 rounded-md overflow-hidden border">
                          <img src={safeImage(p)} alt={`photo-${idx}`} className="object-cover w-full h-full" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setModalSrc(null)}>
          <div className="max-w-3xl w-full p-4">
            <img src={modalSrc} alt="preview" className="w-full h-[60vh] object-contain rounded-md shadow-lg" />
          </div>
        </div>
      )}
    </section>
  );
}

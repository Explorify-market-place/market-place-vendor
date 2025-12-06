// lib/mockPackages.ts
export type Package = {
  id: number;
  title: string;
  price: string;
  location: string;
  days: string;
  rating?: number;
  image?: string;   // optional, can be provided later
  city?: string;    // optional alias
  type?: string;
};

export const samplePackages: Package[] = [
  { id: 1, title: "Himalayan Adventure: Manali & Solang", price: "₹9,999", location: "Manali, HP", days: "4 days", rating: 4.8, type: "Attraction" },
  { id: 2, title: "Goa Beach Bliss - Deluxe", price: "₹7,499", location: "Goa", days: "3 days", rating: 4.7, type: "Destination" },
  { id: 3, title: "Rajasthan Royal Tour (Jaipur, Udaipur)", price: "₹15,499", location: "Rajasthan", days: "6 days", rating: 4.9, type: "Attraction" },
  { id: 4, title: "Kerala Backwaters & Ayurvedic Retreat", price: "₹12,999", location: "Kerala", days: "5 days", rating: 4.8, type: "Destination" },
  { id: 5, title: "Goa Watersports Weekend", price: "₹5,499", location: "Goa", days: "2 days", rating: 4.6, type: "Attraction" },
  { id: 6, title: "Mumbai City Lights: Evening Tour", price: "₹2,499", location: "Mumbai", days: "0.5 day", rating: 4.5, type: "Attraction" },
  { id: 7, title: "Shimla Scenic Weekend", price: "₹6,999", location: "Shimla", days: "2 days", rating: 4.6, type: "Destination" },
  // add more if you want...
];

export function searchPackages(term?: string) {
  if (!term) return samplePackages;

  const q = term.trim().toLowerCase();

  return samplePackages.filter((pkg) =>
    [
      pkg.title?.toLowerCase() || "",
      pkg.location?.toLowerCase() || "",
      pkg.type?.toLowerCase() || "",
      pkg.city?.toLowerCase() || ""
    ].some((field) => field.includes(q))
  );
}

export function getPackageById(id: number) {
  return samplePackages.find((p) => p.id === id) ?? null;
}

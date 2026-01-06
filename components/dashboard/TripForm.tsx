"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, MapPin, DollarSign, Image, FileText } from "lucide-react";

import { FileUpload } from "@/components/ui/file-upload";

interface TripFormProps {
  onClose: () => void;
  onSuccess: () => void;
  vendorId: string;
  initialData?: any;
}

export function TripForm({
  onClose,
  onSuccess,
  vendorId,
  initialData,
}: TripFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    image: initialData?.image || "",
    itinerary: initialData?.itinerary || "",
    startRoute: initialData?.route?.[0] || "",
    endRoute: initialData?.route?.[1] || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData ? `/api/plans/${initialData.planId}` : "/api/plans";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          image: formData.image,
          itinerary: formData.itinerary,
          route: [formData.startRoute, formData.endRoute],
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        console.error("Failed to save trip");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {initialData ? "Edit Trip" : "Add New Trip"}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {initialData
                ? "Update trip details"
                : "Create a new travel experience"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Trip Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Golden Triangle Tour"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Image className="w-4 h-4 inline mr-1 text-blue-500" />
                Trip Image
              </label>
              <FileUpload
                endpoint="tripImage"
                value={formData.image}
                onChange={(url) =>
                  setFormData({ ...formData, image: url || "" })
                }
                onRemove={() => setFormData({ ...formData, image: "" })}
              />
            </div>

            {/* Itinerary Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1 text-blue-500" />
                Itinerary PDF
              </label>
              <FileUpload
                endpoint="tripItinerary"
                value={formData.itinerary}
                onChange={(url) =>
                  setFormData({ ...formData, itinerary: url || "" })
                }
                onRemove={() => setFormData({ ...formData, itinerary: "" })}
              />
            </div>

            {/* Route */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  From
                </label>
                <input
                  type="text"
                  required
                  value={formData.startRoute}
                  onChange={(e) =>
                    setFormData({ ...formData, startRoute: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Starting point"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  To
                </label>
                <input
                  type="text"
                  required
                  value={formData.endRoute}
                  onChange={(e) =>
                    setFormData({ ...formData, endRoute: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Destination"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1 text-blue-500" />
                Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder:text-slate-400"
                placeholder="Describe your travel experience..."
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price (₹)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }

                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                placeholder="0"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20"
              >
                {loading ? "Saving..." : initialData ? "Update Trip" : "Create Trip"}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="bg-gray-100 dark:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

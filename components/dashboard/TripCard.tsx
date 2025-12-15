"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface TripCardProps {
  trip: {
    planId: string;
    name: string;
    image: string;
    route: string[];
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
  };
  onUpdate: () => void;
}

export function TripCard({ trip, onUpdate }: TripCardProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/plans/${trip.planId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setConfirmOpen(false);
        onUpdate();
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/plans/${trip.planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !trip.isActive }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating trip:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={
            trip.image ||
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500"
          }
          alt={trip.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={trip.isActive ? "default" : "secondary"}>
            <Activity className="w-3 h-3 mr-1" />
            {trip.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {trip.name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {trip.route[0]} → {trip.route[trip.route.length - 1]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
          {trip.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-lg font-bold text-blue-600 dark:text-blue-400">
            <DollarSign className="w-4 h-4 mr-1" />₹
            {trip.price.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 inline mr-1" />
            {new Date(trip.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
            className="flex-1"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {editing ? "Cancel" : "Edit"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleActive}
            disabled={loading}
            className="flex-1"
          >
            {trip.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete this trip?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  This will permanently delete the trip from the database. This
                  action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

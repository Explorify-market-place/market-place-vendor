"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { TripForm } from "@/components/vendor/TripForm";
import { TripCard } from "@/components/vendor/TripCard";

interface VendorDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    vendorVerified: boolean;
  };
}

export default function VendorDashboard({ user }: VendorDashboardProps) {
  const [isVerified, setIsVerified] = useState(user.vendorVerified);
  const [showTripForm, setShowTripForm] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetVerified = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/vendor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Error verifying vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await fetch(`/api/plans?vendorId=${user.id}`);
      const data = await response.json();
      setTrips(data.plans || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    if (isVerified) {
      fetchTrips();
    }
  }, [isVerified, user.id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your travel experiences and grow your business
          </p>
        </div>

        {/* Verification Status */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isVerified ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                )}
                <div>
                  <CardTitle className="text-xl">
                    {isVerified ? "Verified Vendor" : "Verification Required"}
                  </CardTitle>
                  <CardDescription>
                    {isVerified
                      ? "You're verified and can start offering trips"
                      : "Get verified to start offering your travel experiences"}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={isVerified ? "default" : "secondary"}>
                {isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
          </CardHeader>
          {!isVerified && (
            <CardContent>
              <Button
                onClick={handleGetVerified}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Verifying..." : "Get Verified"}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Stats Cards */}
        {isVerified && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Trips
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {trips.length}
                    </p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Trips
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {trips.filter((trip: any) => trip.isActive).length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      0
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trip Management */}
        {isVerified && (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Trips
              </h2>
              <Button
                onClick={() => setShowTripForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Trip
              </Button>
            </div>

            {/* Trip Form Modal */}
            {showTripForm && (
              <TripForm
                onClose={() => setShowTripForm(false)}
                onSuccess={() => {
                  setShowTripForm(false);
                  fetchTrips();
                }}
                vendorId={user.id}
              />
            )}

            {/* Active Trips */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Active Trips
              </h3>
              {trips.filter((t) => t.isActive).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips
                    .filter((t) => t.isActive)
                    .map((trip) => (
                      <TripCard
                        key={trip.planId}
                        trip={trip}
                        onUpdate={fetchTrips}
                      />
                    ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-8 text-center text-gray-600 dark:text-gray-400">
                    No active trips
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Inactive Trips */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Inactive Trips
              </h3>
              {trips.filter((t) => !t.isActive).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips
                    .filter((t) => !t.isActive)
                    .map((trip) => (
                      <TripCard
                        key={trip.planId}
                        trip={trip}
                        onUpdate={fetchTrips}
                      />
                    ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-8 text-center text-gray-600 dark:text-gray-400">
                    No inactive trips
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Empty state */}
            {trips.length === 0 && (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No trips yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start by adding your first travel experience
                  </p>
                  <Button
                    onClick={() => setShowTripForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Trip
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

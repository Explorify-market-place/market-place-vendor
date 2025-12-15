"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  ArrowRight,
  Settings,
} from "lucide-react";
import { TripForm } from "@/components/dashboard/TripForm";
import { TripCard } from "@/components/dashboard/TripCard";
import {
  checkVendorCompletion,
  getVendorCompletionMessage,
  type VendorCompletionStatus,
} from "@/lib/vendor-utils";

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
  const router = useRouter();
  const [showTripForm, setShowTripForm] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [completionStatus, setCompletionStatus] =
    useState<VendorCompletionStatus | null>(null);

  // Fetch vendor data to check completion status
  const fetchVendorData = async () => {
    try {
      const response = await fetch("/api/vendor/settings");
      if (response.ok) {
        const data = await response.json();
        const status = checkVendorCompletion(data);
        setCompletionStatus(status);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
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
    fetchVendorData();
    fetchTrips();
  }, [user.id]);

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

        {/* Profile Completion Status */}
        {completionStatus && !completionStatus.isComplete && (
          <Card className="mb-8 border-2 border-amber-500/20 bg-amber-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                  <div>
                    <CardTitle className="text-xl">
                      Complete Your Profile
                    </CardTitle>
                    <CardDescription>
                      {getVendorCompletionMessage(completionStatus)}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  {completionStatus.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <span className="text-sm">
                    {completionStatus.isVerified
                      ? "✓ Admin verified"
                      : "⏳ Awaiting admin verification"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {completionStatus.hasOrgDetails ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <span className="text-sm">
                    {completionStatus.hasOrgDetails
                      ? "✓ Organization details added"
                      : "⏳ Add organization details"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {completionStatus.hasBankDetails ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                  <span className="text-sm">
                    {completionStatus.hasBankDetails
                      ? "✓ Bank details added"
                      : "⏳ Add bank account or UPI"}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => router.push("/settings")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Complete Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {completionStatus && completionStatus.isComplete && (
          <Card className="mb-8 border-2 border-green-500/20 bg-green-500/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <CardTitle className="text-xl">Profile Complete</CardTitle>
                    <CardDescription>
                      You're all set to offer travel experiences!
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500">Verified</Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Stats Cards */}
        {completionStatus?.isComplete && (
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
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Trips
            </h2>
            <Button
              onClick={() => {
                if (completionStatus?.isComplete) {
                  setShowTripForm(true);
                } else {
                  router.push("/settings");
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {completionStatus?.isComplete ? (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Trip
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Complete Profile First
                </>
              )}
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
                  {completionStatus?.isComplete
                    ? "Start by adding your first travel experience"
                    : "Complete your profile to start adding trips"}
                </p>
                <Button
                  onClick={() => {
                    if (completionStatus?.isComplete) {
                      setShowTripForm(true);
                    } else {
                      router.push("/settings");
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {completionStatus?.isComplete ? (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Trip
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Complete Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

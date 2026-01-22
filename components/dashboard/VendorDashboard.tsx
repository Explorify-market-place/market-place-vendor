"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  FileStack,
} from "lucide-react";
import { TripForm } from "@/components/dashboard/TripForm";
import { TripCard } from "@/components/dashboard/TripCard";
import { BulkPdfUpload } from "@/components/dashboard/BulkPdfUpload";
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
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [completionStatus, setCompletionStatus] =
    useState<VendorCompletionStatus | null>(null);

  // Fetch vendor data to check completion status
  const fetchVendorData = useCallback(async () => {
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
  }, []);

  const fetchTrips = useCallback(async () => {
    try {
      const response = await fetch(`/api/plans?vendorId=${user.id}`);
      const data = await response.json();
      setTrips(data.plans || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchVendorData();
    fetchTrips();
  }, [fetchVendorData, fetchTrips]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage your travel experiences and grow your business
          </p>
        </div>

        {/* Profile Completion Status */}
        {completionStatus && !completionStatus.isComplete && (
          <Card className="mb-8 border border-amber-500/30 bg-amber-500/10 backdrop-blur-md shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-amber-500/20">
                    <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
                      Complete Your Profile
                    </CardTitle>
                    <CardDescription className="text-amber-800/80 dark:text-amber-200/80">
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
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                      You&apos;re all set to offer travel experiences!
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
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Total Trips
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {trips.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <MapPin className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Active Trips
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {trips.filter((trip: any) => trip.isActive).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <Calendar className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Total Bookings
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      0
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <Users className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trip Management */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Your Trips
            </h2>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (completionStatus?.isComplete) {
                    setShowBulkUpload(true);
                  } else {
                    toast.warning("Please complete your profile first");
                  }
                }}
                variant="outline"
                className="bg-white/70 dark:bg-slate-900/70"
              >
                <FileStack className="w-4 h-4 mr-2" />
                Bulk Upload PDFs
              </Button>
              <Button
                onClick={() => {
                  if (completionStatus?.isComplete) {
                    setShowTripForm(true);
                  } else {
                    router.push("/settings");
                  }
                }}
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
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
          </div>

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
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 border-dashed">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No trips yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
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
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
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

      {/* Trip Form Modal */}
      {showTripForm && (
        <TripForm
          vendorId={user.id}
          onClose={() => setShowTripForm(false)}
          onSuccess={() => {
            setShowTripForm(false);
            fetchTrips();
          }}
        />
      )}

      {/* Bulk PDF Upload Modal */}
      {showBulkUpload && (
        <BulkPdfUpload
          onClose={() => {
            setShowBulkUpload(false);
            fetchTrips();
          }}
        />
      )}
    </div>
  );
}

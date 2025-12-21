"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";

interface Departure {
  departureId: string;
  planId: string;
  departureDate: string;
  pickupLocation: string;
  pickupTime: string;
  totalCapacity: number;
  bookedSeats: number;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface DepartureManagerProps {
  planId: string;
  onClose: () => void;
}

export function DepartureManager({ planId, onClose }: DepartureManagerProps) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    departureDate: "",
    pickupLocation: "",
    pickupTime: "06:00",
    totalCapacity: 20,
  });

  // Bulk form state
  const [bulkData, setBulkData] = useState({
    startDate: "",
    endDate: "",
    frequency: "daily" as "daily" | "weekly",
    weekDays: [] as number[], // 0=Sunday, 1=Monday, etc.
    pickupLocation: "",
    pickupTime: "06:00",
    totalCapacity: 20,
  });

  useEffect(() => {
    fetchDepartures();
  }, [planId]);

  const fetchDepartures = async () => {
    try {
      const response = await fetch(`/api/departures?planId=${planId}`);
      if (response.ok) {
        const data = await response.json();
        setDepartures(data.departures || []);
      }
    } catch (error) {
      console.error("Error fetching departures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? `/api/departures/${editingId}`
        : "/api/departures";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          ...formData,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({
          departureDate: "",
          pickupLocation: "",
          pickupTime: "06:00",
          totalCapacity: 20,
        });
        fetchDepartures();
      }
    } catch (error) {
      console.error("Error saving departure:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate dates based on frequency
      const dates: string[] = [];
      const start = new Date(bulkData.startDate);
      const end = new Date(bulkData.endDate);

      if (bulkData.frequency === "daily") {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d).toISOString().split("T")[0]);
        }
      } else if (
        bulkData.frequency === "weekly" &&
        bulkData.weekDays.length > 0
      ) {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (bulkData.weekDays.includes(d.getDay())) {
            dates.push(new Date(d).toISOString().split("T")[0]);
          }
        }
      }

      // Create all departures
      const promises = dates.map((date) =>
        fetch("/api/departures", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId,
            departureDate: date,
            pickupLocation: bulkData.pickupLocation,
            pickupTime: bulkData.pickupTime,
            totalCapacity: bulkData.totalCapacity,
          }),
        })
      );

      await Promise.all(promises);

      setShowForm(false);
      setBulkMode(false);
      setBulkData({
        startDate: "",
        endDate: "",
        frequency: "daily",
        weekDays: [],
        pickupLocation: "",
        pickupTime: "06:00",
        totalCapacity: 20,
      });
      fetchDepartures();
    } catch (error) {
      console.error("Error creating bulk departures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (departure: Departure) => {
    setEditingId(departure.departureId);
    setFormData({
      departureDate: departure.departureDate.split("T")[0],
      pickupLocation: departure.pickupLocation,
      pickupTime: departure.pickupTime,
      totalCapacity: departure.totalCapacity,
    });
    setShowForm(true);
  };

  const handleDelete = async (departureId: string) => {
    if (!confirm("Are you sure you want to delete this departure?")) return;

    try {
      const response = await fetch(`/api/departures/${departureId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDepartures();
      }
    } catch (error) {
      console.error("Error deleting departure:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Manage Departures</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {/* Add Departure Buttons */}
          {!showForm && (
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => {
                  setEditingId(null);
                  setBulkMode(false);
                  setFormData({
                    departureDate: "",
                    pickupLocation: "",
                    pickupTime: "06:00",
                    totalCapacity: 20,
                  });
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Single Departure
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setBulkMode(true);
                  setBulkData({
                    startDate: "",
                    endDate: "",
                    frequency: "daily",
                    weekDays: [],
                    pickupLocation: "",
                    pickupTime: "06:00",
                    totalCapacity: 20,
                  });
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Bulk Create
              </Button>
            </div>
          )}

          {/* Form */}
          {showForm && !bulkMode && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 border rounded-lg"
            >
              <h3 className="font-semibold mb-3">
                {editingId ? "Edit Departure" : "New Departure"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.departureDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departureDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.pickupTime}
                    onChange={(e) =>
                      setFormData({ ...formData, pickupTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter meeting point address"
                    value={formData.pickupLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupLocation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.totalCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalCapacity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={loading}>
                  {editingId ? "Update" : "Create"} Departure
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Bulk Create Form */}
          {showForm && bulkMode && (
            <form
              onSubmit={handleBulkSubmit}
              className="mb-6 p-4 border rounded-lg"
            >
              <h3 className="font-semibold mb-3">Bulk Create Departures</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bulkData.startDate}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    min={
                      bulkData.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    value={bulkData.endDate}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Frequency
                  </label>
                  <select
                    value={bulkData.frequency}
                    onChange={(e) =>
                      setBulkData({
                        ...bulkData,
                        frequency: e.target.value as "daily" | "weekly",
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="daily">Every Day</option>
                    <option value="weekly">Specific Days of Week</option>
                  </select>
                </div>

                {bulkData.frequency === "weekly" && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Select Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day, index) => (
                          <label
                            key={day}
                            className="flex items-center gap-1 px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={bulkData.weekDays.includes(index)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBulkData({
                                    ...bulkData,
                                    weekDays: [...bulkData.weekDays, index],
                                  });
                                } else {
                                  setBulkData({
                                    ...bulkData,
                                    weekDays: bulkData.weekDays.filter(
                                      (d) => d !== index
                                    ),
                                  });
                                }
                              }}
                            />
                            {day}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    required
                    value={bulkData.pickupTime}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, pickupTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={bulkData.totalCapacity}
                    onChange={(e) =>
                      setBulkData({
                        ...bulkData,
                        totalCapacity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter meeting point address"
                    value={bulkData.pickupLocation}
                    onChange={(e) =>
                      setBulkData({
                        ...bulkData,
                        pickupLocation: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    (bulkData.frequency === "weekly" &&
                      bulkData.weekDays.length === 0)
                  }
                >
                  {loading ? "Creating..." : "Create Departures"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setBulkMode(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Departures List */}
          {loading && !showForm ? (
            <p className="text-center py-8 text-gray-500">
              Loading departures...
            </p>
          ) : departures.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No departures scheduled yet. Click "Schedule New Departure" to add
              one.
            </p>
          ) : (
            <div className="space-y-3">
              {departures.map((departure) => {
                const availableSeats =
                  departure.totalCapacity - departure.bookedSeats;
                const occupancyPercent =
                  (departure.bookedSeats / departure.totalCapacity) * 100;

                return (
                  <div
                    key={departure.departureId}
                    className="border rounded-lg p-4 hover:border-gray-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span className="font-semibold">
                              {formatDate(departure.departureDate)}
                            </span>
                          </div>
                          <Badge className={getStatusColor(departure.status)}>
                            {departure.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {departure.pickupTime}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {departure.bookedSeats}/{departure.totalCapacity}{" "}
                            booked
                          </div>
                        </div>

                        <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">
                            {departure.pickupLocation}
                          </span>
                        </div>

                        {/* Occupancy Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                occupancyPercent >= 90
                                  ? "bg-red-500"
                                  : occupancyPercent >= 70
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {availableSeats} seats available
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(departure)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(departure.departureId)}
                          disabled={departure.bookedSeats > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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
  ChevronLeft,
  ChevronRight,
  AlertCircle,
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
  isActive: boolean;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface DepartureCalendarProps {
  planId: string;
  onClose: () => void;
}

export function DepartureCalendar({ planId, onClose }: DepartureCalendarProps) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
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

  // Cancellation form
  const [cancelReason, setCancelReason] = useState("");

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
        setSelectedDate(null);
      } else {
        alert("Failed to save departure");
      }
    } catch (error) {
      console.error("Error saving departure:", error);
      alert("Failed to save departure");
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
      alert(`Successfully created ${dates.length} departures`);
    } catch (error) {
      console.error("Error creating bulk departures:", error);
      alert("Failed to create bulk departures");
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
    setSelectedDate(departure.departureDate.split("T")[0]);
  };

  const handleDelete = async (departureId: string) => {
    if (!confirm("Are you sure you want to delete this departure?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/departures/${departureId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDepartures();
        setSelectedDate(null);
      } else {
        alert("Failed to delete departure");
      }
    } catch (error) {
      console.error("Error deleting departure:", error);
      alert("Failed to delete departure");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDeparture = async (departureId: string) => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }

    if (
      !confirm(
        "This will cancel the departure and automatically refund all bookings. Are you sure?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/departures/${departureId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Departure cancelled. ${result.refundResults.successful} bookings refunded successfully.`
        );
        setCancelling(null);
        setCancelReason("");
        fetchDepartures();
        setSelectedDate(null);
      } else {
        const error = await response.json();
        alert(`Failed to cancel departure: ${error.error}`);
      }
    } catch (error) {
      console.error("Error cancelling departure:", error);
      alert("Failed to cancel departure");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  // Group departures by date
  const departuresByDate = departures.reduce((acc, dep) => {
    const dateKey = dep.departureDate.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(dep);
    return acc;
  }, {} as Record<string, Departure[]>);

  const hasDeparture = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return departuresByDate[dateStr] && departuresByDate[dateStr].length > 0;
  };

  const getDepartureCount = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return departuresByDate[dateStr]?.length || 0;
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setShowForm(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
    setSelectedDate(null);
  };

  const selectedDateDepartures = selectedDate
    ? departuresByDate[selectedDate] || []
    : [];

  const getAvailableSeats = (departure: Departure) => {
    return departure.totalCapacity - departure.bookedSeats;
  };

  const getOccupancyPercent = (departure: Departure) => {
    return (departure.bookedSeats / departure.totalCapacity) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Manage Departures</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="font-semibold text-lg">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <Button variant="ghost" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  )
                )}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Calendar days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const hasDep = hasDeparture(day);
                  const count = getDepartureCount(day);
                  const dateStr = `${year}-${String(month + 1).padStart(
                    2,
                    "0"
                  )}-${String(day).padStart(2, "0")}`;
                  const isSelected = selectedDate === dateStr;
                  const isPast =
                    new Date(dateStr) <
                    new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        aspect-square rounded-lg p-2 text-sm transition-all relative
                        hover:bg-primary/10 hover:scale-105
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-bold"
                            : hasDep
                            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold"
                            : isPast
                            ? "opacity-40"
                            : ""
                        }
                      `}
                    >
                      <div>{day}</div>
                      {hasDep && count > 1 && (
                        <div className="absolute top-1 right-1 px-1 bg-current text-background rounded-full text-[10px] leading-none">
                          {count}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Add Buttons */}
              {!showForm && (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setEditingId(null);
                      setBulkMode(false);
                      setFormData({
                        departureDate: selectedDate || "",
                        pickupLocation: "",
                        pickupTime: "06:00",
                        totalCapacity: 20,
                      });
                      setShowForm(true);
                    }}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Single Departure
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBulkMode(true);
                      setBulkData({
                        startDate: selectedDate || "",
                        endDate: "",
                        frequency: "daily",
                        weekDays: [],
                        pickupLocation: "",
                        pickupTime: "06:00",
                        totalCapacity: 20,
                      });
                      setShowForm(true);
                    }}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Bulk Create
                  </Button>
                </div>
              )}

              {/* Single Departure Form */}
              {showForm && !bulkMode && (
                <form
                  onSubmit={handleSubmit}
                  className="p-4 border rounded-lg bg-background/50"
                >
                  <h3 className="font-semibold mb-3">
                    {editingId ? "Edit Departure" : "New Departure"}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        disabled={!!editingId}
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.departureDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            departureDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {editingId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Date cannot be changed after creation
                        </p>
                      )}
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
                          setFormData({
                            ...formData,
                            pickupTime: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Meeting point address"
                        value={formData.pickupLocation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pickupLocation: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Capacity
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
                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button type="submit" disabled={loading} size="sm">
                      {editingId ? "Update" : "Create"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
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
                  className="p-4 border rounded-lg bg-background/50"
                >
                  <h3 className="font-semibold mb-3">Bulk Create Departures</h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
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
                            setBulkData({
                              ...bulkData,
                              startDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
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
                            setBulkData({
                              ...bulkData,
                              endDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div>
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
                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Specific Days</option>
                      </select>
                    </div>

                    {bulkData.frequency === "weekly" && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Select Days
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: "Sun", value: 0 },
                            { label: "Mon", value: 1 },
                            { label: "Tue", value: 2 },
                            { label: "Wed", value: 3 },
                            { label: "Thu", value: 4 },
                            { label: "Fri", value: 5 },
                            { label: "Sat", value: 6 },
                          ].map((day) => (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => {
                                const newDays = bulkData.weekDays.includes(
                                  day.value
                                )
                                  ? bulkData.weekDays.filter(
                                      (d) => d !== day.value
                                    )
                                  : [...bulkData.weekDays, day.value];
                                setBulkData({ ...bulkData, weekDays: newDays });
                              }}
                              className={`px-2 py-1 text-xs rounded border ${
                                bulkData.weekDays.includes(day.value)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background"
                              }`}
                            >
                              {day.label}
                            </button>
                          ))}
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
                          setBulkData({
                            ...bulkData,
                            pickupTime: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Meeting point address"
                        value={bulkData.pickupLocation}
                        onChange={(e) =>
                          setBulkData({
                            ...bulkData,
                            pickupLocation: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Capacity
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
                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button type="submit" disabled={loading} size="sm">
                      Create All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
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
            </div>

            {/* Selected Date Details */}
            <div className="lg:col-span-1">
              {selectedDate ? (
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
                    {formatDate(selectedDate)}
                  </h3>

                  {selectedDateDepartures.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No departures</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateDepartures.map((departure) => {
                        const availableSeats = getAvailableSeats(departure);
                        const occupancyPercent = getOccupancyPercent(departure);
                        const isPast =
                          new Date(departure.departureDate) < new Date();

                        return (
                          <Card
                            key={departure.departureId}
                            className={
                              !departure.isActive
                                ? "border-red-500/50 bg-red-500/5"
                                : ""
                            }
                          >
                            <CardContent className="p-4 space-y-3">
                              {!departure.isActive && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Cancelled
                                </Badge>
                              )}

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {departure.pickupTime}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  <span className="line-clamp-1">
                                    {departure.pickupLocation}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-3 h-3" />
                                  <span>
                                    {departure.bookedSeats} /{" "}
                                    {departure.totalCapacity}
                                  </span>
                                </div>
                              </div>

                              {/* Occupancy bar */}
                              <div>
                                <div className="h-1.5 bg-border/30 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      occupancyPercent >= 90
                                        ? "bg-red-500"
                                        : occupancyPercent >= 70
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    }`}
                                    style={{ width: `${occupancyPercent}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {availableSeats} seats available
                                </p>
                              </div>

                              {departure.isActive && !isPast && (
                                <>
                                  {cancelling === departure.departureId ? (
                                    <div className="space-y-2">
                                      <textarea
                                        placeholder="Cancellation reason..."
                                        value={cancelReason}
                                        onChange={(e) =>
                                          setCancelReason(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border rounded-md text-sm dark:bg-slate-800"
                                        rows={2}
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() =>
                                            handleCancelDeparture(
                                              departure.departureId
                                            )
                                          }
                                          disabled={loading}
                                        >
                                          Confirm Cancel
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setCancelling(null);
                                            setCancelReason("");
                                          }}
                                        >
                                          Back
                                        </Button>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        ⚠️ All {departure.bookedSeats} bookings
                                        will be refunded
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(departure)}
                                        disabled={loading}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      {departure.bookedSeats === 0 ? (
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() =>
                                            handleDelete(departure.departureId)
                                          }
                                          disabled={loading}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() =>
                                            setCancelling(departure.departureId)
                                          }
                                          disabled={loading}
                                        >
                                          Cancel
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}

                              {departure.cancellationReason && (
                                <div className="text-xs text-muted-foreground border-t pt-2">
                                  <p className="font-medium">Reason:</p>
                                  <p>{departure.cancellationReason}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a date to view departures</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

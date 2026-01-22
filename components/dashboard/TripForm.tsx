"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  X,
  MapPin,
  DollarSign,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { BulkImageUpload } from "@/components/dashboard/BulkImageUpload";

interface TripFormProps {
  onClose: () => void;
  onSuccess: () => void;
  vendorId: string;
  initialData?: any;
}

interface Stop {
  name: string;
  description: string;
  activities: string[];
  duration: number;
  order: number;
}

export function TripForm({
  onClose,
  onSuccess,
  vendorId,
  initialData,
}: TripFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showBulkImageUpload, setShowBulkImageUpload] = useState(false);

  // Step 1: Basic Info
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [price, setPrice] = useState(initialData?.price || "");
  const [durationValue, setDurationValue] = useState(
    initialData?.duration?.value || 1,
  );
  const [durationUnit, setDurationUnit] = useState<"hours" | "days" | "nights">(
    initialData?.duration?.unit || "days",
  );
  const [maxParticipants, setMaxParticipants] = useState(
    initialData?.maxParticipants || "",
  );
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  // Step 2: Itinerary
  const [startingPoint, setStartingPoint] = useState(
    initialData?.startingPoint || "",
  );
  const [endingPoint, setEndingPoint] = useState(
    initialData?.endingPoint || "",
  );
  const [meetingPoint, setMeetingPoint] = useState(
    initialData?.meetingPoint || "",
  );
  const [stops, setStops] = useState<Stop[]>(initialData?.stops || []);

  // Step 3: Inclusions
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights || [],
  );
  const [included, setIncluded] = useState<string[]>(
    initialData?.included || [],
  );
  const [excluded, setExcluded] = useState<string[]>(
    initialData?.excluded || [],
  );
  const [categories, setCategories] = useState<string[]>(
    initialData?.categories || [],
  );
  const [interests, setInterests] = useState<string[]>(
    initialData?.interests || [],
  );
  const [languages, setLanguages] = useState<string[]>(
    initialData?.languages || [],
  );
  const [wheelchairAccessible, setWheelchairAccessible] = useState(
    initialData?.accessibility?.wheelchairAccessible || false,
  );
  const [infantSeatAvailable, setInfantSeatAvailable] = useState(
    initialData?.accessibility?.infantSeatAvailable || false,
  );
  const [strollerAccessible, setStrollerAccessible] = useState(
    initialData?.accessibility?.strollerAccessible || false,
  );

  // Step 4: Practical Info
  const [whatToBring, setWhatToBring] = useState<string[]>(
    initialData?.whatToBring || [],
  );
  const [notAllowed, setNotAllowed] = useState<string[]>(
    initialData?.notAllowed || [],
  );
  const [notSuitableFor, setNotSuitableFor] = useState<string[]>(
    initialData?.notSuitableFor || [],
  );
  const [knowBeforeYouGo, setKnowBeforeYouGo] = useState<string[]>(
    initialData?.knowBeforeYouGo || [],
  );

  const steps = ["Basic Info", "Itinerary", "Inclusions", "Practical Info"];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return name.trim() !== "" && price !== "" && Number(price) > 0;
      case 1:
      case 2:
      case 3:
        return true; // Optional fields
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.warning("Please fill in all required fields");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.warning("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const url = initialData
        ? `/api/plans/${initialData.planId}`
        : "/api/plans";
      const method = initialData ? "PUT" : "POST";

      const payload = {
        vendorId,
        name,
        description,
        price: Number(price),
        maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
        images,
        duration: { value: durationValue, unit: durationUnit },
        startingPoint,
        endingPoint,
        meetingPoint,
        stops,
        highlights,
        included,
        excluded,
        categories,
        interests,
        languages,
        accessibility: {
          wheelchairAccessible,
          infantSeatAvailable,
          strollerAccessible,
        },
        whatToBring,
        notAllowed,
        notSuitableFor,
        knowBeforeYouGo,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(initialData ? "Trip updated successfully!" : "Trip created successfully!");
        onSuccess();
      } else {
        console.error("Failed to save trip");
        toast.error("Failed to save trip. Please try again.");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Error creating trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for array fields
  const addToArray = (
    array: string[],
    setter: (arr: string[]) => void,
    value: string,
  ) => {
    if (value.trim()) {
      setter([...array, value.trim()]);
    }
  };

  const removeFromArray = (
    array: string[],
    setter: (arr: string[]) => void,
    index: number,
  ) => {
    setter(array.filter((_, i) => i !== index));
  };

  const addStop = () => {
    const newStop: Stop = {
      name: "",
      description: "",
      activities: [],
      duration: 0,
      order: stops.length + 1,
    };
    setStops([...stops, newStop]);
  };

  const updateStop = (index: number, field: keyof Stop, value: any) => {
    const updatedStops = [...stops];
    updatedStops[index] = { ...updatedStops[index], [field]: value };
    setStops(updatedStops);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl my-8">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">
              {initialData ? "Edit Trip" : "Create New Trip"}
            </CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* Progress Indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep
                        ? "bg-green-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={index}
                className={`text-xs ${
                  index === currentStep
                    ? "text-blue-600 font-medium"
                    : "text-slate-500"
                }`}
                style={{ flex: 1, textAlign: "center" }}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trip Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Golden Triangle Tour"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg resize-none"
                    rows={3}
                    placeholder="Brief description of the trip..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <DollarSign className="inline w-4 h-4 mr-1" />
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Users className="inline w-4 h-4 mr-1" />
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Optional"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Duration
                    </label>
                    <input
                      type="number"
                      value={durationValue}
                      onChange={(e) => setDurationValue(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unit
                    </label>
                    <select
                      value={durationUnit}
                      onChange={(e) =>
                        setDurationUnit(
                          e.target.value as "hours" | "days" | "nights",
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="nights">Nights</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trip Images
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    First image will be used as the main image
                  </p>

                  {/* Bulk Upload Button */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBulkImageUpload(true)}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Upload Images
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setImages([...images, ""])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add One
                    </Button>
                  </div>

                  {/* Individual Image Uploads */}
                  {images.map((img, index) => (
                    <div key={index} className="mb-2">
                      <FileUpload
                        endpoint="tripImage"
                        value={img}
                        onChange={(key) => {
                          const updated = [...images];
                          updated[index] = key || "";
                          setImages(updated);
                        }}
                        onRemove={() => {
                          setImages(images.filter((_, i) => i !== index));
                        }}
                        planId={initialData?.planId || `temp-${Date.now()}`}
                        index={index + 1}
                      />
                    </div>
                  ))}

                  {images.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4 border border-dashed rounded-lg">
                      No images added yet
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Itinerary */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Starting Point
                    </label>
                    <input
                      type="text"
                      value={startingPoint}
                      onChange={(e) => setStartingPoint(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., Hotel pickup"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Ending Point
                    </label>
                    <input
                      type="text"
                      value={endingPoint}
                      onChange={(e) => setEndingPoint(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., Delhi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meeting Point
                  </label>
                  <input
                    type="text"
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Pickup from hotel/airport"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stops
                  </label>
                  {stops.map((stop, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">
                          Stop {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStop(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={stop.name}
                          onChange={(e) =>
                            updateStop(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Location name"
                        />
                        <textarea
                          value={stop.description}
                          onChange={(e) =>
                            updateStop(index, "description", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                          rows={2}
                          placeholder="Description"
                        />
                        <input
                          type="number"
                          value={stop.duration}
                          onChange={(e) =>
                            updateStop(
                              index,
                              "duration",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          placeholder="Duration (minutes)"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addStop}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Inclusions */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <ArrayInput
                  label="Highlights"
                  items={highlights}
                  onAdd={(val) => addToArray(highlights, setHighlights, val)}
                  onRemove={(i) =>
                    removeFromArray(highlights, setHighlights, i)
                  }
                  placeholder="e.g., Private transportation"
                />

                <ArrayInput
                  label="What's Included"
                  items={included}
                  onAdd={(val) => addToArray(included, setIncluded, val)}
                  onRemove={(i) => removeFromArray(included, setIncluded, i)}
                  placeholder="e.g., Hotel pickup"
                />

                <ArrayInput
                  label="What's Excluded"
                  items={excluded}
                  onAdd={(val) => addToArray(excluded, setExcluded, val)}
                  onRemove={(i) => removeFromArray(excluded, setExcluded, i)}
                  placeholder="e.g., Lunch"
                />

                <ArrayInput
                  label="Categories"
                  items={categories}
                  onAdd={(val) => addToArray(categories, setCategories, val)}
                  onRemove={(i) =>
                    removeFromArray(categories, setCategories, i)
                  }
                  placeholder="e.g., Cultural tours"
                />

                <ArrayInput
                  label="Interests"
                  items={interests}
                  onAdd={(val) => addToArray(interests, setInterests, val)}
                  onRemove={(i) => removeFromArray(interests, setInterests, i)}
                  placeholder="e.g., History"
                />

                <ArrayInput
                  label="Languages"
                  items={languages}
                  onAdd={(val) => addToArray(languages, setLanguages, val)}
                  onRemove={(i) => removeFromArray(languages, setLanguages, i)}
                  placeholder="e.g., English"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Accessibility
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={wheelchairAccessible}
                        onChange={(e) =>
                          setWheelchairAccessible(e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Wheelchair accessible</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={infantSeatAvailable}
                        onChange={(e) =>
                          setInfantSeatAvailable(e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Infant seat available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={strollerAccessible}
                        onChange={(e) =>
                          setStrollerAccessible(e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Stroller accessible</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Practical Info */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <ArrayInput
                  label="What to Bring"
                  items={whatToBring}
                  onAdd={(val) => addToArray(whatToBring, setWhatToBring, val)}
                  onRemove={(i) =>
                    removeFromArray(whatToBring, setWhatToBring, i)
                  }
                  placeholder="e.g., Comfortable shoes"
                />

                <ArrayInput
                  label="Not Allowed"
                  items={notAllowed}
                  onAdd={(val) => addToArray(notAllowed, setNotAllowed, val)}
                  onRemove={(i) =>
                    removeFromArray(notAllowed, setNotAllowed, i)
                  }
                  placeholder="e.g., Drones"
                />

                <ArrayInput
                  label="Not Suitable For"
                  items={notSuitableFor}
                  onAdd={(val) =>
                    addToArray(notSuitableFor, setNotSuitableFor, val)
                  }
                  onRemove={(i) =>
                    removeFromArray(notSuitableFor, setNotSuitableFor, i)
                  }
                  placeholder="e.g., Pregnant women"
                />

                <ArrayInput
                  label="Know Before You Go"
                  items={knowBeforeYouGo}
                  onAdd={(val) =>
                    addToArray(knowBeforeYouGo, setKnowBeforeYouGo, val)
                  }
                  onRemove={(i) =>
                    removeFromArray(knowBeforeYouGo, setKnowBeforeYouGo, i)
                  }
                  placeholder="e.g., Tour starts at 6 AM"
                />
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-blue-600 hover:bg-blue-700"
                disabled={!validateStep(currentStep)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="ml-auto bg-green-600 hover:bg-green-700"
                disabled={loading || !validateStep(currentStep)}
              >
                {loading
                  ? "Saving..."
                  : initialData
                    ? "Update Trip"
                    : "Create Trip"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Image Upload Modal */}
      {showBulkImageUpload && (
        <BulkImageUpload
          planId={initialData?.planId || `temp-${Date.now()}`}
          onComplete={(imageKeys) => {
            setImages([...images, ...imageKeys]);
            setShowBulkImageUpload(false);
          }}
          onClose={() => setShowBulkImageUpload(false)}
        />
      )}
    </div>
  );
}

// Helper Component for Array Inputs
function ArrayInput({
  label,
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
          placeholder={placeholder}
        />
        <Button type="button" onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

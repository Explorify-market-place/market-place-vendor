import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Configure the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Create a document client for easier operations
export const dynamoDb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

// Table names
export const PLANS_TABLE = process.env.DYNAMODB_PLANS_TABLE || "TravelPlans";
export const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || "Users";
export const BOOKINGS_TABLE = process.env.DYNAMODB_BOOKINGS_TABLE || "Bookings";
export const DEPARTURES_TABLE =
  process.env.DYNAMODB_DEPARTURES_TABLE || "Departures";

// Type definitions for DynamoDB items
export interface DynamoDBUser {
  userId: string;
  name: string;
  email: string;
  password?: string; // Optional - only for email/password auth
  image?: string;
  role: "user" | "vendor" | "admin";
  vendorVerified: boolean;
  vendorInfo?: {
    organizationName?: string;
    address?: string;
    phoneNumber?: string;
    bankDetails?: {
      accountHolderName?: string;
      accountNumber?: string;
      ifscCode?: string;
      bankName?: string;
      upiId?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface DynamoDBPlan {
  planId: string;
  vendorId: string;
  name: string;
  images?: string[]; // Multiple images (S3 keys) - first element is main image
  description: string; // Short summary
  fullDescription?: string; // Detailed description from PDF
  price: number;
  maxParticipants?: number;
  itinerary?: string; // PDF S3 key
  vendorCut?: number; // Percentage vendor receives (default 85%)
  createdAt: string;
  updatedAt: string;
  isActive: boolean;

  // Duration & Timing
  duration: {
    value: number; // 8, 12, 3
    unit: "hours" | "days" | "nights"; // flexible for day trips or multi-day
  };

  // Location & Route
  startingPoint?: string; // "Hotel pickup" or specific address
  endingPoint?: string; // "Varanasi" or specific address
  meetingPoint?: string; // "Pickup From Hotel/Varanasi Airport"
  stops: Array<{
    name: string; // "Ganges River", "Manikarnika Ghat"
    description?: string; // Additional details
    activities: string[]; // ["Boat cruise", "Guided tour", "Sightseeing"]
    duration?: number; // Minutes at this stop (0 = passing by)
    order: number; // Sequence in itinerary
  }>;

  // Highlights (key selling points)
  highlights: string[]; // ["Private round-trip transportation", "Hotel pickup included"]

  // What's Included & Excluded
  included: string[]; // ["Hotel pickup and drop-off", "Air-conditioned vehicle"]
  excluded: string[]; // ["Lunch", "Gratuities", "Monument Fees"]

  // Practical Information
  whatToBring?: string[]; // ["Passport or ID card", "Comfortable shoes"]
  notAllowed?: string[]; // ["Drones", "Alcohol and drugs", "Feeding animals"]
  notSuitableFor?: string[]; // ["Pregnant women", "People under 3 ft 9 in"]
  knowBeforeYouGo?: string[]; // ["Tour Will Be Start at 05:30", "Lunch not included"]

  // Categories & Interests (LLM will populate these)
  // Examples: "Water activities", "Guided tours", "Day trips", "Adventures", "Cultural experiences"
  // "Spiritual tours", "Wildlife safaris", "Mountain treks", "City tours", "Food tours"
  categories: string[]; // Free-form strings, LLM decides based on trip content

  // Examples: "Boat cruises", "Food & drink", "Photography", "Nightlife", "Temples"
  // "Mountains", "Beaches", "History", "Architecture", "Local culture", "Wildlife"
  interests: string[]; // Free-form strings, LLM decides based on trip appeal

  languages?: string[]; // ["English", "Hindi"]
  accessibility?: {
    wheelchairAccessible?: boolean;
    infantSeatAvailable?: boolean;
    strollerAccessible?: boolean;
  };
}

export interface DynamoDBDeparture {
  departureId: string; // Partition Key
  planId: string; // Links to TravelPlans template
  departureDate: string; // ISO string of trip start date/time
  pickupLocation: string; // Meeting point address
  pickupTime: string; // Time string (e.g., "06:00 AM")
  totalCapacity: number; // Max people for this departure
  bookedSeats: number; // Current bookings count (availableSeats = totalCapacity - bookedSeats)
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
  isActive: boolean; // false if departure cancelled by vendor
  cancelledAt?: string; // When vendor cancelled the departure
  cancellationReason?: string; // Why vendor cancelled
  createdAt: string;
  updatedAt: string;
}

export interface DynamoDBBooking {
  bookingId: string;
  planId: string; // Keep for queries and backward compatibility
  departureId: string; // Links to specific scheduled departure
  userId: string;
  tripDate: string; // Keep for refund logic and future payout lambda
  numPeople: number;
  paymentStatus: "pending" | "completed" | "failed";
  bookingStatus?: "confirmed" | "cancelled" | "completed"; // Trip status
  tripCost: number; // Base trip cost (plan.price × numPeople)
  platformFee: number; // 2% fee on tripCost, paid by user
  totalAmount: number; // tripCost + platformFee (total paid by user)
  createdAt: string;

  // Razorpay payment fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  // Refund tracking
  refundStatus: "none" | "requested" | "processing" | "completed" | "rejected";
  refundPercentage?: number; // Percentage of tripCost refunded (0, 50, or 100)
  refundAmount?: number; // Actual rupees refunded to user
  refundDate?: string;
  razorpayRefundId?: string;
  cancelledAt?: string;
  cancellationReason?: string; // Reason for cancellation (user or vendor)

  // Vendor payout tracking
  vendorPayoutStatus: "pending" | "processing" | "completed" | "failed";
  vendorPayoutAmount?: number; // Amount to transfer to vendor (85% of trip cost)
  vendorPayoutDate?: string;
  platformCut?: number; // Platform revenue from trip cost (15% default)
}

/**
 * DynamoDB Entity Types
 *
 * Central type definitions for all DynamoDB table entities.
 * These types are the source of truth for the data model.
 */

// ============ USER ENTITY ============

export interface BankDetails {
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
}

export interface VendorInfo {
  organizationName?: string;
  address?: string;
  phoneNumber?: string;
  bankDetails?: BankDetails;
}

export type UserRole = "user" | "vendor" | "admin";

export interface DynamoDBUser {
  userId: string;
  name: string;
  email: string;
  password?: string; // Optional - only for email/password auth
  image?: string;
  role: UserRole;
  vendorVerified: boolean;
  vendorInfo?: VendorInfo;
  createdAt: string;
  updatedAt: string;
}

// ============ PLAN ENTITY ============

export interface Duration {
  value: number;
  unit: "hours" | "days" | "nights";
}

export interface Stop {
  name: string;
  description?: string;
  activities: string[];
  duration?: number; // Minutes at this stop
  order: number;
}

export interface Accessibility {
  wheelchairAccessible?: boolean;
  infantSeatAvailable?: boolean;
  strollerAccessible?: boolean;
}

export interface DynamoDBPlan {
  planId: string;
  vendorId: string;
  name: string;
  images?: string[];
  description: string;
  fullDescription?: string;
  price: number;
  maxParticipants?: number;
  itinerary?: string; // PDF S3 key
  vendorCut?: number; // Percentage vendor receives (default 85%)
  createdAt: string;
  updatedAt: string;
  isActive: boolean;

  duration: Duration;
  startingPoint?: string;
  endingPoint?: string;
  meetingPoint?: string;
  stops: Stop[];

  highlights: string[];
  included: string[];
  excluded: string[];

  whatToBring?: string[];
  notAllowed?: string[];
  notSuitableFor?: string[];
  knowBeforeYouGo?: string[];

  categories: string[];
  interests: string[];

  languages?: string[];
  accessibility?: Accessibility;
}

// ============ DEPARTURE ENTITY ============

export type DepartureStatus =
  | "scheduled"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface DynamoDBDeparture {
  departureId: string;
  planId: string;
  departureDate: string;
  pickupLocation: string;
  pickupTime: string;
  totalCapacity: number;
  bookedSeats: number;
  status: DepartureStatus;
  isActive: boolean;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ BOOKING ENTITY ============

export type PaymentStatus = "pending" | "completed" | "failed";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "failed";
export type RefundStatus =
  | "none"
  | "requested"
  | "processing"
  | "completed"
  | "rejected";
export type VendorPayoutStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface DynamoDBBooking {
  bookingId: string;
  planId: string;
  departureId: string;
  userId: string;
  tripDate: string;
  numPeople: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  tripCost: number;
  platformFee: number;
  totalAmount: number;
  createdAt: string;

  // Razorpay payment fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  // Refund tracking
  refundStatus: RefundStatus;
  refundPercentage?: number;
  refundAmount?: number;
  refundDate?: string;
  razorpayRefundId?: string;
  cancelledAt?: string;
  cancellationReason?: string;

  // Vendor payout tracking
  vendorPayoutStatus: VendorPayoutStatus;
  vendorPayoutAmount?: number;
  vendorPayoutDate?: string;
  platformCut?: number;
}

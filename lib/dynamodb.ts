import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Configure the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
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
  image: string;
  route: string[];
  description: string;
  price: number;
  vendorCut?: number; // Percentage vendor receives (default 85%)
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface DynamoDBBooking {
  bookingId: string;
  planId: string;
  userId: string;
  tripDate: string; // Trip start date
  numPeople: number;
  paymentStatus: "pending" | "completed" | "failed";
  bookingStatus?: "confirmed" | "cancelled" | "completed"; // Trip status
  totalAmount: number; // Total paid by user (trip cost + platform fee)
  createdAt: string;

  // Razorpay payment fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  // Refund tracking
  refundStatus: "none" | "requested" | "processing" | "completed" | "rejected";
  refundAmount?: number;
  refundDate?: string;
  razorpayRefundId?: string;

  // Vendor payout tracking
  vendorPayoutStatus: "pending" | "processing" | "completed" | "failed";
  vendorPayoutAmount?: number; // Amount to transfer to vendor (85% of trip cost)
  vendorPayoutDate?: string;
  platformCut?: number; // Platform revenue from trip cost (15% default)
}

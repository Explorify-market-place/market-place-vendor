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
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface DynamoDBBooking {
  bookingId: string;
  planId: string;
  userId: string;
  dateBooked: string;
  numPeople: number;
  paymentStatus: "pending" | "completed" | "failed";
  totalAmount: number;
  createdAt: string;
}

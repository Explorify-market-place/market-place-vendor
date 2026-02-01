import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Re-export types from centralized types folder
export type {
  DynamoDBUser,
  DynamoDBPlan,
  DynamoDBDeparture,
  DynamoDBBooking,
  Stop,
  Duration,
  Accessibility,
  VendorInfo,
  BankDetails,
  UserRole,
  DepartureStatus,
  PaymentStatus,
  BookingStatus,
  RefundStatus,
  VendorPayoutStatus,
} from "@/types/dynamodb";

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

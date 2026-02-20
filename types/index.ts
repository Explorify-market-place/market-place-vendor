/**
 * Central Types Export
 *
 * Re-exports all types from the types directory for convenient imports.
 * Usage: import { DynamoDBUser, DynamoDBPlan } from "@/types";
 */

// DynamoDB entity types
export type {
  DynamoDBUser,
  DynamoDBPlan,
  DynamoDBDeparture,
  DynamoDBBooking,
  // Sub-types
  BankDetails,
  VendorInfo,
  UserRole,
  Duration,
  Stop,
  Accessibility,
  DepartureStatus,
  PaymentStatus,
  BookingStatus,
  RefundStatus,
  VendorPayoutStatus,
} from "./dynamodb";

// DynamoDB utility types
export type {
  ExpressionAttributeValues,
  ExpressionAttributeNames,
  DynamoDBUpdateInput,
} from "./dynamodb-utils";

// API types
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  LambdaExtractionResponse,
  PlanExtractionResult,
} from "./api";

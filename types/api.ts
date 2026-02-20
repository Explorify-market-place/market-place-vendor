/**
 * API Types
 *
 * Common types for API responses and requests.
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Error response from API
 */
export interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
}

/**
 * Response from the Lambda extraction endpoint.
 * Used by both PDF and link processing flows.
 */
export interface LambdaExtractionResponse {
  name?: string;
  description?: string;
  price?: number;
  duration?: {
    value: number;
    unit: "hours" | "days" | "nights";
  };
  startingPoint?: string;
  endingPoint?: string;
  meetingPoint?: string;
  stops?: Array<{
    name: string;
    description?: string;
    activities: string[];
    duration?: number;
    order: number;
  }>;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  whatToBring?: string[];
  notAllowed?: string[];
  notSuitableFor?: string[];
  knowBeforeYouGo?: string[];
  categories?: string[];
  interests?: string[];
  languages?: string[];
  accessibility?: {
    wheelchairAccessible?: boolean;
    infantSeatAvailable?: boolean;
    strollerAccessible?: boolean;
  };
  maxParticipants?: number;
  fullDescription?: string;
}

/**
 * Result returned from plan extraction server actions
 */
export type PlanExtractionResult =
  | { success: true; planId: string; name: string }
  | { success: false; error: string };

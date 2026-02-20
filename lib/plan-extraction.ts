/**
 * Plan Extraction Service
 *
 * Shared logic for creating plans from Lambda extraction results.
 * Used by both PDF and link extraction server actions.
 */

import { randomUUID } from "crypto";
import type { LambdaExtractionResponse } from "@/types";
import type { DynamoDBPlan } from "@/lib/dynamodb";
import { createPlan } from "@/lib/db-helpers";
import { generateItineraryKey } from "@/lib/s3";

/** Lambda endpoint for PDF/link extraction */
export const LAMBDA_URL =
  "https://jeubsu5h36ulifpl7c3gw7jci40msjya.lambda-url.ap-south-1.on.aws/";

/**
 * Call the Lambda extraction endpoint with a given payload.
 * Works for both PDF (sends `{ pdf: key }`) and link (sends `{ link: url }`) payloads.
 */
export async function callExtractionLambda(
  payload: Record<string, string>,
): Promise<LambdaExtractionResponse> {
  const response = await fetch(LAMBDA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({
      ...payload,
      secret: process.env.API_SECRET,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lambda processing failed: ${errorText}`);
  }

  return response.json();
}

/**
 * Build a DynamoDBPlan from extracted Lambda data.
 * Applies sensible defaults for missing fields.
 */
export function buildPlanFromExtraction(
  extractedData: LambdaExtractionResponse,
  vendorId: string,
  options?: {
    pdfSource?: boolean; // If true, sets itinerary key based on planId
    sourceLink?: string; // Original URL for link imports
  },
): DynamoDBPlan {
  const now = new Date().toISOString();
  const planId = randomUUID();

  return {
    planId,
    vendorId,
    name: extractedData.name || "Untitled Trip",
    description: extractedData.description || "",
    fullDescription: extractedData.fullDescription,
    price: extractedData.price || 1000,
    maxParticipants: extractedData.maxParticipants,
    images: [],
    itinerary: options?.pdfSource ? generateItineraryKey(planId) : undefined,
    vendorCut: 85,
    isActive: false,
    createdAt: now,
    updatedAt: now,

    // Duration
    duration: extractedData.duration || { value: 1, unit: "days" },

    // Location
    startingPoint: extractedData.startingPoint,
    endingPoint: extractedData.endingPoint,
    meetingPoint: extractedData.meetingPoint,

    // Stops
    stops: extractedData.stops || [],

    // Highlights & Inclusions
    highlights: extractedData.highlights || [],
    included: extractedData.included || [],
    excluded: extractedData.excluded || [],

    // Practical Info
    whatToBring: extractedData.whatToBring,
    notAllowed: extractedData.notAllowed,
    notSuitableFor: extractedData.notSuitableFor,
    knowBeforeYouGo: extractedData.knowBeforeYouGo,

    // Categories & Interests
    categories: extractedData.categories || [],
    interests: extractedData.interests || [],

    // Languages & Accessibility
    languages: extractedData.languages,
    accessibility: extractedData.accessibility,

    // Source tracking
    sourceLink: options?.sourceLink,
  };
}

/**
 * Full pipeline: call Lambda → build plan → save to DynamoDB.
 * Returns the created plan.
 */
export async function extractAndCreatePlan(
  lambdaPayload: Record<string, string>,
  vendorId: string,
  options?: {
    pdfSource?: boolean;
    sourceLink?: string;
  },
): Promise<DynamoDBPlan> {
  const extractedData = await callExtractionLambda(lambdaPayload);
  const plan = buildPlanFromExtraction(extractedData, vendorId, options);
  return createPlan(plan);
}

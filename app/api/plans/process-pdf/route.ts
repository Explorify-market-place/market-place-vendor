import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dynamoDb, PLANS_TABLE, DynamoDBPlan } from "@/lib/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  getPublicUrl,
  moveObject,
  generateItineraryKey,
  S3_BUCKET,
} from "@/lib/s3";
import { randomUUID } from "crypto";

// Lambda endpoint from demo.js
const LAMBDA_URL =
  "https://jeubsu5h36ulifpl7c3gw7jci40msjya.lambda-url.ap-south-1.on.aws/";

interface LambdaResponse {
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

export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pdfKey } = body; // Temporary S3 key for uploaded PDF

    if (!pdfKey) {
      return NextResponse.json(
        { error: "PDF key is required" },
        { status: 400 },
      );
    }

    console.log(`Processing PDF - Key: ${pdfKey}`);

    // Call Lambda with S3 key (Lambda will read directly from S3)
    // Matches demo.js readPdf() function format
    const lambdaResponse = await fetch(LAMBDA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        pdf: pdfKey, // Send S3 key like: "itineraries/temp-uuid-timestamp-spiti.pdf"
      }),
    });

    if (!lambdaResponse.ok) {
      const errorText = await lambdaResponse.text();
      console.error("Lambda error response:", errorText);
      throw new Error(`Lambda processing failed: ${errorText}`);
    }

    const extractedData: LambdaResponse = await lambdaResponse.json();

    // Generate plan ID
    const planId = randomUUID();
    const now = new Date().toISOString();

    // Create plan in DynamoDB
    const plan: DynamoDBPlan = {
      planId,
      vendorId: session.user.id,
      name: extractedData.name || "Untitled Trip",
      description: extractedData.description || "",
      fullDescription: extractedData.fullDescription,
      price: extractedData.price || 1000, // Default price if not provided
      maxParticipants: extractedData.maxParticipants,
      images: [], // Initially empty, vendor can add later
      itinerary: generateItineraryKey(planId), // Final S3 key
      vendorCut: 85,
      isActive: true,
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
    };

    // Save to DynamoDB
    await dynamoDb.send(
      new PutCommand({
        TableName: PLANS_TABLE,
        Item: plan,
      }),
    );

    // Move PDF from temp location to final location (itineraries/{planId}.pdf)
    await moveObject(pdfKey, generateItineraryKey(planId));

    return NextResponse.json({
      success: true,
      planId,
      name: plan.name,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);

    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to process PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

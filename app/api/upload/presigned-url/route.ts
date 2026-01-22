import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  generatePresignedUploadUrl,
  generateProfileImageKey,
  generateTripImageKey,
  generateTempItineraryKey,
} from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { uploadType, fileName, contentType, planId, index } = body;

    if (!uploadType || !fileName || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let key: string;
    const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";

    // Generate S3 key based on upload type
    switch (uploadType) {
      case "profileImage":
        key = generateProfileImageKey(session.user.id, extension);
        break;

      case "tripImage":
        if (!planId || index === undefined) {
          return NextResponse.json(
            { error: "planId and index required for trip images" },
            { status: 400 },
          );
        }
        key = generateTripImageKey(planId, index, extension);
        break;

      case "tripItinerary":
        // For bulk upload, generate temp key (will be moved after plan creation)
        key = generateTempItineraryKey(session.user.id, fileName);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid upload type" },
          { status: 400 },
        );
    }

    // Generate presigned URL (15 minute expiration)
    const presignedUrl = await generatePresignedUploadUrl(
      key,
      contentType,
      900,
    );

    return NextResponse.json({
      uploadUrl: presignedUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL: " },
      { status: 500 },
    );
  }
}

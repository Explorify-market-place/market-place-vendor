import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configure the S3 client
const client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Bucket name
export const S3_BUCKET =
  process.env.AWS_S3_BUCKET_NAME || "explorify-trips-ap-south-1";
const S3_REGION = process.env.AWS_REGION || "ap-south-1";

/**
 * Generate a presigned URL for uploading a file to S3
 * @param key - The S3 key (path) where the file will be stored
 * @param contentType - The MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 900 = 15 minutes)
 * @returns Presigned URL for PUT request
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 900,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

/**
 * Construct a public S3 URL from a key
 * @param key - The S3 key (e.g., "profile-images/user-123.jpg")
 * @returns Full public S3 URL
 */
export function getPublicUrl(key: string): string {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

/**
 * Move an object from one S3 location to another
 * @param sourceKey - Current S3 key
 * @param destinationKey - New S3 key
 */
export async function moveObject(
  sourceKey: string,
  destinationKey: string,
): Promise<void> {
  try {
    // Copy object to new location
    await client.send(
      new CopyObjectCommand({
        Bucket: S3_BUCKET,
        CopySource: `${S3_BUCKET}/${sourceKey}`,
        Key: destinationKey,
      }),
    );

    // Delete original object
    await client.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: sourceKey,
      }),
    );
  } catch (error) {
    console.error("Error moving object in S3:", error);
    throw error;
  }
}

/**
 * Delete an object from S3
 * @param key - The S3 key to delete
 */
export async function deleteObject(key: string): Promise<void> {
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      }),
    );
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    throw error;
  }
}

/**
 * Generate S3 key for profile image
 * @param userId - User ID
 * @param extension - File extension (e.g., "jpg", "png")
 * @returns S3 key
 */
export function generateProfileImageKey(
  userId: string,
  extension: string,
): string {
  return `profile-images/${userId}.${extension}`;
}

/**
 * Generate S3 key for trip image
 * @param planId - Plan ID
 * @param index - Image index (1, 2, 3, etc.)
 * @param extension - File extension
 * @returns S3 key
 */
export function generateTripImageKey(
  planId: string,
  index: number,
  extension: string,
): string {
  return `trip-images/${planId}/${index}.${extension}`;
}

/**
 * Generate S3 key for itinerary PDF
 * @param planId - Plan ID
 * @returns S3 key
 */
export function generateItineraryKey(planId: string): string {
  return `itineraries/${planId}.pdf`;
}

/**
 * Generate temporary S3 key for uploaded PDF (before plan creation)
 * @param vendorId - Vendor ID
 * @param fileName - Original file name
 * @returns S3 key
 */
export function generateTempItineraryKey(
  vendorId: string,
  fileName: string,
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `itineraries/temp-${vendorId}-${timestamp}-${sanitizedFileName}`;
}
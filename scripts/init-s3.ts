import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  PutPublicAccessBlockCommand,
  PutBucketPolicyCommand,
  BucketLocationConstraint,
} from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const region = process.env.AWS_REGION || "ap-south-1";
const bucketName =
  process.env.AWS_S3_BUCKET_NAME || `explorify-trips-${region}`;

const client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function createBucket() {
  try {
    // Check if bucket already exists
    try {
      await client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket ${bucketName} already exists`);
      return;
    } catch (error: unknown) {
      if ((error as { name?: string })?.name !== "NotFound") {
        throw error;
      }
    }

    // Create bucket
    console.log(`Creating bucket: ${bucketName}`);
    await client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
        // Only specify location constraint if not us-east-1
        ...(region !== "us-east-1" && {
          CreateBucketConfiguration: {
            LocationConstraint: region as BucketLocationConstraint,
          },
        }),
      }),
    );
    console.log(`Bucket ${bucketName} created successfully`);
  } catch (error) {
    console.error(`Error creating bucket:`, error);
    throw error;
  }
}

async function configureCORS() {
  try {
    console.log("Configuring CORS...");
    await client.send(
      new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ["*"],
              AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
              AllowedOrigins: [
                "https://explorifytrips.com",
                "https://www.explorifytrips.com",
                "https://vendor.explorifytrips.com",
              ],
              ExposeHeaders: ["ETag"],
              MaxAgeSeconds: 3000,
            },
          ],
        },
      }),
    );
    console.log("CORS configured successfully");
  } catch (error) {
    console.error("Error configuring CORS:", error);
    throw error;
  }
}

async function configurePublicAccess() {
  try {
    console.log("Configuring public access...");

    // Disable block public access for the bucket
    await client.send(
      new PutPublicAccessBlockCommand({
        Bucket: bucketName,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          IgnorePublicAcls: false,
          BlockPublicPolicy: false,
          RestrictPublicBuckets: false,
        },
      }),
    );

    // Add bucket policy for public read access
    const bucketPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      }),
    );

    console.log("Public access configured successfully");
  } catch (error) {
    console.error("Error configuring public access:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("Initializing S3 bucket...");
    console.log(`Bucket name: ${bucketName}`);
    console.log(`Region: ${region}`);

    await createBucket();
    await configureCORS();
    await configurePublicAccess();

    console.log("\n✅ S3 initialization complete!");
    console.log("\nFolder structure:");
    console.log(`  ${bucketName}/`);
    console.log(`  ├── profile-images/`);
    console.log(`  │   └── {userId}.{ext}`);
    console.log(`  ├── trip-images/`);
    console.log(`  │   └── {planId}/`);
    console.log(`  │       ├── 1.jpg`);
    console.log(`  │       ├── 2.jpg`);
    console.log(`  │       └── ...`);
    console.log(`  └── itineraries/`);
    console.log(`      └── {planId}.pdf`);
    console.log(
      `\nAdd this to your .env.local:\nAWS_S3_BUCKET_NAME=${bucketName}`,
    );
  } catch (error) {
    console.error("Failed to initialize S3:", error);
    process.exit(1);
  }
}

main();

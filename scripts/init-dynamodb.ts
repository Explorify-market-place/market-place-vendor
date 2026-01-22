import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  KeyType,
  ScalarAttributeType,
} from "@aws-sdk/client-dynamodb";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Table names from environment or defaults
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || "Users";
const PLANS_TABLE = process.env.DYNAMODB_PLANS_TABLE || "TravelPlans";
const BOOKINGS_TABLE = process.env.DYNAMODB_BOOKINGS_TABLE || "Bookings";
const DEPARTURES_TABLE = process.env.DYNAMODB_DEPARTURES_TABLE || "Departures";

async function createTable(
  tableName: string,
  keySchema: { AttributeName: string; KeyType: KeyType }[],
  attributeDefinitions: {
    AttributeName: string;
    AttributeType: ScalarAttributeType;
  }[],
) {
  try {
    // Check if table already exists
    try {
      await client.send(new DescribeTableCommand({ TableName: tableName }));
      console.log(`Table ${tableName} already exists`);
      return;
    } catch (error: unknown) {
      if ((error as { name?: string })?.name !== "ResourceNotFoundException") {
        throw error;
      }
    }

    // Create table
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attributeDefinitions,
      BillingMode: "PAY_PER_REQUEST", // On-demand billing
    });

    await client.send(command);
    console.log(`Table ${tableName} created successfully`);

    // Wait for table to be active
    let tableActive = false;
    while (!tableActive) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const describeCommand = new DescribeTableCommand({
        TableName: tableName,
      });
      const response = await client.send(describeCommand);
      tableActive = response.Table?.TableStatus === "ACTIVE";
    }
    console.log(`Table ${tableName} is now active`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    throw error;
  }
}

async function createAllTables() {
  // Users table - single partition key
  await createTable(
    USERS_TABLE,
    [{ AttributeName: "userId", KeyType: KeyType.HASH }],
    [{ AttributeName: "userId", AttributeType: ScalarAttributeType.S }],
  );

  // TravelPlans table - partition key only (updated schema)
  await createTable(
    PLANS_TABLE,
    [{ AttributeName: "planId", KeyType: KeyType.HASH }],
    [{ AttributeName: "planId", AttributeType: ScalarAttributeType.S }],
  );

  // Bookings table - single partition key
  await createTable(
    BOOKINGS_TABLE,
    [{ AttributeName: "bookingId", KeyType: KeyType.HASH }],
    [{ AttributeName: "bookingId", AttributeType: ScalarAttributeType.S }],
  );

  // Departures table - partition key with GSI for plan queries
  await createTable(
    DEPARTURES_TABLE,
    [{ AttributeName: "departureId", KeyType: KeyType.HASH }],
    [{ AttributeName: "departureId", AttributeType: ScalarAttributeType.S }],
  );
}

async function main() {
  try {
    console.log("Initializing DynamoDB tables...");
    await createAllTables();
    console.log("DynamoDB initialization complete!");
  } catch (error) {
    console.error("Failed to initialize DynamoDB:", error);
    process.exit(1);
  }
}

main();

import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, KeyType, ScalarAttributeType } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as dotenv from "dotenv";
import { randomUUID } from "crypto";

// Load environment variables
dotenv.config({ path: ".env.local" });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment or defaults
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || "Users";
const PLANS_TABLE = process.env.DYNAMODB_PLANS_TABLE || "TravelPlans";
const BOOKINGS_TABLE = process.env.DYNAMODB_BOOKINGS_TABLE || "Bookings";

async function createTable(tableName: string, keySchema: { AttributeName: string; KeyType: KeyType }[], attributeDefinitions: { AttributeName: string; AttributeType: ScalarAttributeType }[]) {
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
      const describeCommand = new DescribeTableCommand({ TableName: tableName });
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
    [{ AttributeName: "userId", AttributeType: ScalarAttributeType.S }]
  );

  // TravelPlans table - partition key only (updated schema)
  await createTable(
    PLANS_TABLE,
    [{ AttributeName: "planId", KeyType: KeyType.HASH }],
    [{ AttributeName: "planId", AttributeType: ScalarAttributeType.S }]
  );

  // Bookings table - single partition key
  await createTable(
    BOOKINGS_TABLE,
    [{ AttributeName: "bookingId", KeyType: KeyType.HASH }],
    [{ AttributeName: "bookingId", AttributeType: ScalarAttributeType.S }]
  );
}

async function seedData() {
  try {
    // Seed sample plans
    const samplePlans = [
      {
        planId: randomUUID(),
        vendorId: "default-vendor",
        name: "Golden Triangle Tour",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500",
        route: ["Delhi", "Agra", "Jaipur", "Delhi"],
        description: "Experience India's most iconic destinations - Delhi's historic monuments, Agra's Taj Mahal, and Jaipur's royal palaces",
        price: 45000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
      {
        planId: randomUUID(),
        vendorId: "default-vendor",
        name: "Kerala Backwaters Journey",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500",
        route: ["Kochi", "Munnar", "Thekkady", "Alleppey", "Kochi"],
        description: "Cruise through Kerala's serene backwaters, explore tea plantations, and enjoy houseboat stays",
        price: 38000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
      {
        planId: randomUUID(),
        vendorId: "default-vendor",
        name: "Himalayan Adventure",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500",
        route: ["Manali", "Rohtang Pass", "Leh", "Nubra Valley", "Pangong Lake"],
        description: "Trek through breathtaking mountain landscapes and experience the beauty of Ladakh",
        price: 65000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
    ];

    for (const plan of samplePlans) {
      const command = new PutCommand({
        TableName: PLANS_TABLE,
        Item: plan,
      });
      await docClient.send(command);
      console.log(`Added plan: ${plan.name}`);
    }

    // Seed sample users
    const sampleUsers = [
      {
        userId: randomUUID(),
        name: "Admin User",
        email: "admin@explorify.com",
        role: "admin",
        vendorVerified: true,
        createdAt: new Date().toISOString(),
      },
      {
        userId: randomUUID(),
        name: "Vendor User",
        email: "vendor@explorify.com",
        role: "vendor",
        vendorVerified: true,
        vendorInfo: {
          organizationName: "Adventure Tours Co.",
          address: "123 Travel Street, Mumbai",
          phoneNumber: "+91-9876543210",
        },
        createdAt: new Date().toISOString(),
      },
    ];

    for (const user of sampleUsers) {
      const command = new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      });
      await docClient.send(command);
      console.log(`Added user: ${user.name}`);
    }

    console.log("Sample data added successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("Initializing DynamoDB tables...");
    await createAllTables();
    console.log("Adding sample data...");
    await seedData();
    console.log("DynamoDB initialization complete!");
  } catch (error) {
    console.error("Failed to initialize DynamoDB:", error);
    process.exit(1);
  }
}

main();

import { dynamoDb, USERS_TABLE, PLANS_TABLE, BOOKINGS_TABLE, DynamoDBUser, DynamoDBPlan, DynamoDBBooking } from "./dynamodb";
import { GetCommand, PutCommand, UpdateCommand, QueryCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

// ============ USER OPERATIONS ============

export async function getUserByEmail(email: string): Promise<DynamoDBUser | null> {
  try {
    const command = new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });
    const response = await dynamoDb.send(command);
    return response.Items && response.Items.length > 0 ? response.Items[0] as DynamoDBUser : null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

export async function getUserById(userId: string): Promise<DynamoDBUser | null> {
  try {
    const command = new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId },
    });
    const response = await dynamoDb.send(command);
    return response.Item as DynamoDBUser || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

export async function createUser(user: DynamoDBUser): Promise<DynamoDBUser> {
  const command = new PutCommand({
    TableName: USERS_TABLE,
    Item: user,
  });
  await dynamoDb.send(command);
  return user;
}

export async function updateUser(userId: string, updates: Partial<DynamoDBUser>): Promise<void> {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: any = {};
  const expressionAttributeNames: any = {};

  Object.entries(updates).forEach(([key, value], index) => {
    if (key !== "userId") {
      const attributeName = `#attr${index}`;
      const attributeValue = `:val${index}`;
      updateExpressions.push(`${attributeName} = ${attributeValue}`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = value;
    }
  });

  if (updateExpressions.length === 0) return;

  const command = new UpdateCommand({
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  await dynamoDb.send(command);
}

export async function getPendingVendors(): Promise<DynamoDBUser[]> {
  try {
    const command = new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: "#role = :role AND vendorVerified = :verified",
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":role": "vendor",
        ":verified": false,
      },
    });
    const response = await dynamoDb.send(command);
    return (response.Items || []) as DynamoDBUser[];
  } catch (error) {
    console.error("Error getting pending vendors:", error);
    return [];
  }
}

// ============ PLAN OPERATIONS ============

export async function getPlanById(planId: string): Promise<DynamoDBPlan | null> {
  try {
    const command = new GetCommand({
      TableName: PLANS_TABLE,
      Key: { planId },
    });
    const response = await dynamoDb.send(command);
    return (response.Item as DynamoDBPlan) || null;
  } catch (error) {
    console.error("Error getting plan by ID:", error);
    return null;
  }
}

export async function getAllActivePlans(): Promise<DynamoDBPlan[]> {
  try {
    const command = new ScanCommand({
      TableName: PLANS_TABLE,
      FilterExpression: "isActive = :isActive",
      ExpressionAttributeValues: {
        ":isActive": true,
      },
    });
    const response = await dynamoDb.send(command);
    return (response.Items || []) as DynamoDBPlan[];
  } catch (error) {
    console.error("Error getting all active plans:", error);
    return [];
  }
}

export async function getPlansByVendor(vendorId: string): Promise<DynamoDBPlan[]> {
  try {
    const command = new ScanCommand({
      TableName: PLANS_TABLE,
      FilterExpression: "vendorId = :vendorId",
      ExpressionAttributeValues: {
        ":vendorId": vendorId,
      },
    });
    const response = await dynamoDb.send(command);
    return (response.Items || []) as DynamoDBPlan[];
  } catch (error) {
    console.error("Error getting plans by vendor:", error);
    return [];
  }
}

export async function createPlan(plan: DynamoDBPlan): Promise<DynamoDBPlan> {
  const command = new PutCommand({
    TableName: PLANS_TABLE,
    Item: plan,
  });
  await dynamoDb.send(command);
  return plan;
}

export async function updatePlan(planId: string, updates: Partial<DynamoDBPlan>): Promise<void> {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: any = {};
  const expressionAttributeNames: any = {};

  Object.entries(updates).forEach(([key, value], index) => {
    if (key !== "planId") {
      const attributeName = `#attr${index}`;
      const attributeValue = `:val${index}`;
      updateExpressions.push(`${attributeName} = ${attributeValue}`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = value;
    }
  });

  if (updateExpressions.length === 0) return;

  const command = new UpdateCommand({
    TableName: PLANS_TABLE,
    Key: { planId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  await dynamoDb.send(command);
}

export async function deletePlan(planId: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: PLANS_TABLE,
    Key: { planId },
  });
  await dynamoDb.send(command);
}

// ============ BOOKING OPERATIONS ============

export async function createBooking(booking: DynamoDBBooking): Promise<DynamoDBBooking> {
  const command = new PutCommand({
    TableName: BOOKINGS_TABLE,
    Item: booking,
  });
  await dynamoDb.send(command);
  return booking;
}

export async function getBookingsByUser(userId: string): Promise<DynamoDBBooking[]> {
  try {
    const command = new ScanCommand({
      TableName: BOOKINGS_TABLE,
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });
    const response = await dynamoDb.send(command);
    return (response.Items || []) as DynamoDBBooking[];
  } catch (error) {
    console.error("Error getting bookings by user:", error);
    return [];
  }
}

export async function getBookingById(bookingId: string): Promise<DynamoDBBooking | null> {
  try {
    const command = new GetCommand({
      TableName: BOOKINGS_TABLE,
      Key: { bookingId },
    });
    const response = await dynamoDb.send(command);
    return response.Item as DynamoDBBooking || null;
  } catch (error) {
    console.error("Error getting booking by ID:", error);
    return null;
  }
}

export async function updateBookingStatus(bookingId: string, paymentStatus: "pending" | "completed" | "failed"): Promise<void> {
  const command = new UpdateCommand({
    TableName: BOOKINGS_TABLE,
    Key: { bookingId },
    UpdateExpression: "SET paymentStatus = :status",
    ExpressionAttributeValues: {
      ":status": paymentStatus,
    },
  });
  await dynamoDb.send(command);
}

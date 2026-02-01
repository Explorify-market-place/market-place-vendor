import {
  dynamoDb,
  USERS_TABLE,
  PLANS_TABLE,
  BOOKINGS_TABLE,
  DEPARTURES_TABLE,
  DynamoDBUser,
  DynamoDBPlan,
  DynamoDBBooking,
  DynamoDBDeparture,
} from "./dynamodb";
import type {
  ExpressionAttributeValues,
  ExpressionAttributeNames,
} from "@/types/dynamodb-utils";
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// ============ USER OPERATIONS ============

export async function getUserByEmail(
  email: string
): Promise<DynamoDBUser | null> {
  try {
    const command = new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });
    const response = await dynamoDb.send(command);
    return response.Items && response.Items.length > 0
      ? (response.Items[0] as DynamoDBUser)
      : null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

export async function getUserById(
  userId: string
): Promise<DynamoDBUser | null> {
  try {
    const command = new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId },
    });
    const response = await dynamoDb.send(command);
    return (response.Item as DynamoDBUser) || null;
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

export async function updateUser(
  userId: string,
  updates: Partial<DynamoDBUser>
): Promise<void> {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: ExpressionAttributeValues = {};
  const expressionAttributeNames: ExpressionAttributeNames = {};

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

export async function getPlanById(
  planId: string
): Promise<DynamoDBPlan | null> {
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

export async function getPlansByVendor(
  vendorId: string
): Promise<DynamoDBPlan[]> {
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

export async function updatePlan(
  planId: string,
  updates: Partial<DynamoDBPlan>
): Promise<void> {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: ExpressionAttributeValues = {};
  const expressionAttributeNames: ExpressionAttributeNames = {};

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

export async function createBooking(
  booking: DynamoDBBooking
): Promise<DynamoDBBooking> {
  const command = new PutCommand({
    TableName: BOOKINGS_TABLE,
    Item: booking,
  });
  await dynamoDb.send(command);
  return booking;
}

export async function getBookingsByUser(
  userId: string
): Promise<DynamoDBBooking[]> {
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

export async function getBookingsByVendor(
  vendorId: string
): Promise<DynamoDBBooking[]> {
  try {
    // First, get all plans by this vendor
    const vendorPlans = await getPlansByVendor(vendorId);
    const planIds = vendorPlans.map((plan) => plan.planId);

    if (planIds.length === 0) {
      return [];
    }

    // Then get all bookings for those plans
    const command = new ScanCommand({
      TableName: BOOKINGS_TABLE,
    });

    const response = await dynamoDb.send(command);
    const allBookings = (response.Items || []) as DynamoDBBooking[];

    // Filter bookings that match vendor's plan IDs
    return allBookings.filter((booking) => planIds.includes(booking.planId));
  } catch (error) {
    console.error("Error getting bookings by vendor:", error);
    return [];
  }
}

export async function getBookingById(
  bookingId: string
): Promise<DynamoDBBooking | null> {
  try {
    const command = new GetCommand({
      TableName: BOOKINGS_TABLE,
      Key: { bookingId },
    });
    const response = await dynamoDb.send(command);
    return (response.Item as DynamoDBBooking) || null;
  } catch (error) {
    console.error("Error getting booking by ID:", error);
    return null;
  }
}

export async function getBookingsByPlan(
  planId: string
): Promise<DynamoDBBooking[]> {
  try {
    const command = new ScanCommand({
      TableName: BOOKINGS_TABLE,
      FilterExpression: "planId = :planId",
      ExpressionAttributeValues: {
        ":planId": planId,
      },
    });
    const response = await dynamoDb.send(command);
    return (response.Items || []) as DynamoDBBooking[];
  } catch (error) {
    console.error("Error getting bookings by plan:", error);
    return [];
  }
}

export async function updateBookingStatus(
  bookingId: string,
  paymentStatus: "pending" | "completed" | "failed"
): Promise<void> {
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

export async function updateBooking(
  bookingId: string,
  updates: Partial<DynamoDBBooking>
): Promise<void> {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: ExpressionAttributeValues = {};
  const expressionAttributeNames: ExpressionAttributeNames = {};

  Object.entries(updates).forEach(([key, value], index) => {
    if (key !== "bookingId") {
      const attributeName = `#attr${index}`;
      const attributeValue = `:val${index}`;
      updateExpressions.push(`${attributeName} = ${attributeValue}`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = value;
    }
  });

  if (updateExpressions.length === 0) return;

  const command = new UpdateCommand({
    TableName: BOOKINGS_TABLE,
    Key: { bookingId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  await dynamoDb.send(command);
}

// ============ DEPARTURE OPERATIONS ============

export async function createDeparture(
  departure: DynamoDBDeparture
): Promise<DynamoDBDeparture> {
  const command = new PutCommand({
    TableName: DEPARTURES_TABLE,
    Item: departure,
  });
  await dynamoDb.send(command);
  return departure;
}

export async function getDepartureById(
  departureId: string
): Promise<DynamoDBDeparture | null> {
  try {
    const command = new GetCommand({
      TableName: DEPARTURES_TABLE,
      Key: { departureId },
    });
    const response = await dynamoDb.send(command);
    return (response.Item as DynamoDBDeparture) || null;
  } catch (error) {
    console.error("Error getting departure by ID:", error);
    return null;
  }
}

export async function getDeparturesByPlan(
  planId: string
): Promise<DynamoDBDeparture[]> {
  try {
    const command = new ScanCommand({
      TableName: DEPARTURES_TABLE,
      FilterExpression: "planId = :planId",
      ExpressionAttributeValues: {
        ":planId": planId,
      },
    });
    const response = await dynamoDb.send(command);
    return (response.Items || []) as DynamoDBDeparture[];
  } catch (error) {
    console.error("Error getting departures by plan:", error);
    return [];
  }
}

export async function updateDeparture(
  departureId: string,
  updates: Partial<DynamoDBDeparture>
): Promise<void> {
  const updateExpressions: string[] = [];
  const expressionAttributeValues: ExpressionAttributeValues = {};
  const expressionAttributeNames: ExpressionAttributeNames = {};

  Object.entries(updates).forEach(([key, value], index) => {
    if (key !== "departureId") {
      const attributeName = `#attr${index}`;
      const attributeValue = `:val${index}`;
      updateExpressions.push(`${attributeName} = ${attributeValue}`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[attributeValue] = value;
    }
  });

  if (updateExpressions.length === 0) return;

  const command = new UpdateCommand({
    TableName: DEPARTURES_TABLE,
    Key: { departureId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  await dynamoDb.send(command);
}

export async function deleteDeparture(departureId: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: DEPARTURES_TABLE,
    Key: { departureId },
  });
  await dynamoDb.send(command);
}

/**
 * Atomically update booked seats for a departure.
 * 
 * HOW DYNAMODB MAKES THIS ATOMIC:
 * DynamoDB uses optimistic locking via ConditionExpression. The update will only
 * succeed if the condition is met at the exact moment of the write. If two requests
 * try to update simultaneously, only ONE will succeed - the other gets
 * ConditionalCheckFailedException and must retry.
 * 
 * This prevents race conditions like:
 * - Two users trying to book the last seat simultaneously
 * - Overbooking beyond capacity
 * - Releasing more seats than were booked
 * 
 * @param departureId - The departure to update
 * @param delta - Positive to reserve seats, negative to release seats
 * @returns true if successful, false if constraints violated (capacity exceeded or negative seats)
 */
export async function updateBookedSeats(
  departureId: string,
  delta: number,
): Promise<boolean> {
  try {
    // DynamoDB atomic update with conditional check
    // This is a single atomic operation - no read-then-write race condition
    const command = new UpdateCommand({
      TableName: DEPARTURES_TABLE,
      Key: { departureId },
      // ADD is atomic - it reads current value and adds delta in one operation
      UpdateExpression: "SET bookedSeats = bookedSeats + :delta, updatedAt = :updatedAt",
      // Condition ensures we never go negative or exceed capacity
      ConditionExpression: 
        "attribute_exists(departureId) AND " +
        "bookedSeats + :delta >= :zero AND " +
        "bookedSeats + :delta <= totalCapacity",
      ExpressionAttributeValues: {
        ":delta": delta,
        ":zero": 0,
        ":updatedAt": new Date().toISOString(),
      },
      // Return the new value for logging
      ReturnValues: "UPDATED_NEW",
    });
    
    const result = await dynamoDb.send(command);
    console.log(`Updated bookedSeats by ${delta}:`, result.Attributes?.bookedSeats);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") {
      console.log(
        `Seat update rejected: delta=${delta} would violate constraints (capacity or negative seats)`,
      );
      return false;
    }
    console.error("Error updating booked seats:", error);
    throw error;
  }
}

// Legacy functions - kept for backward compatibility, delegate to updateBookedSeats
export async function incrementBookedSeats(
  departureId: string,
  numPeople: number
): Promise<boolean> {
  return updateBookedSeats(departureId, numPeople);
}

export async function decrementBookedSeats(
  departureId: string,
  numPeople: number
): Promise<void> {
  const success = await updateBookedSeats(departureId, -numPeople);
  if (!success) {
    throw new Error(`Failed to release ${numPeople} seats - would result in negative count`);
  }
}

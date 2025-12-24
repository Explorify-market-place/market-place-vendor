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
  const expressionAttributeValues: any = {};
  const expressionAttributeNames: any = {};

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
  const expressionAttributeValues: any = {};
  const expressionAttributeNames: any = {};

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

export async function incrementBookedSeats(
  departureId: string,
  numPeople: number
): Promise<boolean> {
  try {
    const command = new UpdateCommand({
      TableName: DEPARTURES_TABLE,
      Key: { departureId },
      UpdateExpression:
        "SET bookedSeats = bookedSeats + :numPeople, updatedAt = :updatedAt",
      ConditionExpression: "bookedSeats + :numPeople <= totalCapacity",
      ExpressionAttributeValues: {
        ":numPeople": numPeople,
        ":updatedAt": new Date().toISOString(),
      },
    });
    await dynamoDb.send(command);
    return true;
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      console.log("Capacity exceeded - cannot book");
      return false;
    }
    console.error("Error incrementing booked seats:", error);
    throw error;
  }
}

export async function decrementBookedSeats(
  departureId: string,
  numPeople: number
): Promise<void> {
  const command = new UpdateCommand({
    TableName: DEPARTURES_TABLE,
    Key: { departureId },
    UpdateExpression:
      "SET bookedSeats = bookedSeats - :numPeople, updatedAt = :updatedAt",
    ConditionExpression: "bookedSeats >= :numPeople",
    ExpressionAttributeValues: {
      ":numPeople": numPeople,
      ":updatedAt": new Date().toISOString(),
    },
  });
  await dynamoDb.send(command);
}

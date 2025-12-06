import { NextRequest, NextResponse } from "next/server";
import { dynamoDb, PLANS_TABLE, DynamoDBPlan } from "@/lib/dynamodb";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

// GET - Fetch all plans for an agency
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get("vendorId");

    // If vendorId provided: return ALL vendor plans (active + inactive) for dashboard
    // Else: public listing → only active plans
    const command = vendorId
      ? new ScanCommand({
          TableName: PLANS_TABLE,
          FilterExpression: "vendorId = :vendorId",
          ExpressionAttributeValues: { ":vendorId": vendorId },
        })
      : new ScanCommand({
          TableName: PLANS_TABLE,
          FilterExpression: "isActive = :isActive",
          ExpressionAttributeValues: { ":isActive": true },
        });

    const response = await dynamoDb.send(command);
    const plans = response.Items || [];

    return NextResponse.json({ plans, count: plans.length });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

// POST - Create a new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vendorId = "default-vendor",
      name,
      image,
      route,
      description,
      price,
    } = body;

    // Validate required fields
    if (!name || !route || !price) {
      return NextResponse.json(
        { error: "Missing required fields: name, route, or price" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const plan: DynamoDBPlan = {
      planId: randomUUID(),
      vendorId,
      name,
      image: image || "",
      route: Array.isArray(route) ? route : [route],
      description: description || "",
      price: Number(price),
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    const command = new PutCommand({
      TableName: PLANS_TABLE,
      Item: plan,
    });

    await dynamoDb.send(command);

    return NextResponse.json({ plan, message: "Plan created successfully" });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}

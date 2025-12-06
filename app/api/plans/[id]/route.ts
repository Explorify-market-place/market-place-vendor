<<<<<<< HEAD
// app/api/plans/[id]/route.ts
=======
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1
import { NextRequest, NextResponse } from "next/server";
import { dynamoDb, PLANS_TABLE } from "@/lib/dynamodb";
import { GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

<<<<<<< HEAD
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const planId = params.id; // use directly
=======
// GET - Fetch a single plan by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = (await params as any).id ?? params.id;
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1

    const command = new GetCommand({
      TableName: PLANS_TABLE,
      Key: { planId },
    });

    const response = await dynamoDb.send(command);

    if (!response.Item) {
<<<<<<< HEAD
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
=======
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1
    }

    return NextResponse.json({ plan: response.Item });
  } catch (error) {
    console.error("Error fetching plan:", error);
<<<<<<< HEAD
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const planId = params.id;
    const body = await request.json();
    const { ...updates } = body;

=======
    return NextResponse.json(
      { error: "Failed to fetch plan" },
      { status: 500 }
    );
  }
}

// PUT - Update a plan
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = (await params as any).id ?? params.id;
    const body = await request.json();
    const { ...updates } = body;

    // Build update expression
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1
    const updateExpressions: string[] = ["updatedAt = :updatedAt"];
    const expressionAttributeValues: Record<string, any> = {
      ":updatedAt": new Date().toISOString(),
    };
    const expressionAttributeNames: Record<string, string> = {};

<<<<<<< HEAD
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "planId" && key !== "vendorId" && value !== undefined) {
=======
    // Add fields to update
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "planId" && key !== "agencyId" && value !== undefined) {
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1
        const attrName = `#${key}`;
        const attrValue = `:${key}`;
        updateExpressions.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = value;
      }
    });

    const command = new UpdateCommand({
      TableName: PLANS_TABLE,
      Key: { planId },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const response = await dynamoDb.send(command);

    return NextResponse.json({
      plan: response.Attributes,
      message: "Plan updated successfully",
    });
  } catch (error) {
    console.error("Error updating plan:", error);
<<<<<<< HEAD
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const planId = params.id;

=======
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a plan (HARD DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const planId = (await params as any).id ?? params.id;

    // Hard delete
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1
    const command = new DeleteCommand({
      TableName: PLANS_TABLE,
      Key: { planId },
    });

    await dynamoDb.send(command);

    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error);
<<<<<<< HEAD
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
=======
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1
  }
}

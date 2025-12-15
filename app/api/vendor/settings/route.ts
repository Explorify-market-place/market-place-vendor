import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/db-helpers";
import { dynamoDb, USERS_TABLE } from "@/lib/dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (excluding password)
    const { password, ...userData } = user;
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching vendor settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "vendor") {
      return NextResponse.json(
        { error: "Only vendors can update vendor settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, image, organizationName, address, phoneNumber, bankDetails } =
      body;

    // Build update expression
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (name !== undefined) {
      updateExpression.push("#name = :name");
      expressionAttributeNames["#name"] = "name";
      expressionAttributeValues[":name"] = name;
    }

    if (image !== undefined) {
      updateExpression.push("#image = :image");
      expressionAttributeNames["#image"] = "image";
      expressionAttributeValues[":image"] = image;
    }

    // Update vendorInfo fields
    const vendorInfo = { ...user.vendorInfo };

    if (organizationName !== undefined) {
      vendorInfo.organizationName = organizationName;
    }
    if (address !== undefined) {
      vendorInfo.address = address;
    }
    if (phoneNumber !== undefined) {
      vendorInfo.phoneNumber = phoneNumber;
    }
    if (bankDetails !== undefined) {
      vendorInfo.bankDetails = {
        ...vendorInfo.bankDetails,
        ...bankDetails,
      };
    }

    updateExpression.push("#vendorInfo = :vendorInfo");
    expressionAttributeNames["#vendorInfo"] = "vendorInfo";
    expressionAttributeValues[":vendorInfo"] = vendorInfo;

    // Always update updatedAt
    updateExpression.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { userId: user.userId },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDb.send(command);

    // Return updated user (excluding password)
    const { password: _, ...updatedUser } = result.Attributes as any;
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating vendor settings:", error);
    return NextResponse.json(
      { error: "Failed to update vendor settings" },
      { status: 500 }
    );
  }
}

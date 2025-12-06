// app/api/vendor/signup/route.ts
import { NextResponse } from "next/server";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, USERS_TABLE } from "@/lib/dynamodb";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

type Body = {
  company?: string;
  name?: string;
  phone?: string;
  website?: string;
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json().catch(() => ({}));
    const { company, name, phone, website, email, password } = body;

    if (!email || !password || !company) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields: company, email, password" },
        { status: 400 }
      );
    }

    // --- Check if email already exists (simple Scan by email)
    // NOTE: For production you should create a GSI on "email" and Query it instead of Scan.
    const scanCmd = new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
      Limit: 1,
    });
    const scanRes = await dynamoDb.send(scanCmd);
    if ((scanRes.Items?.length ?? 0) > 0) {
      return NextResponse.json({ ok: false, message: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const now = new Date().toISOString();
    const user = {
      userId: randomUUID(),
      name: name || company || "Vendor",
      email,
      password: hashed,
      role: "vendor",
      vendorVerified: false,
      vendorInfo: {
        organizationName: company,
        address: "",
        phoneNumber: phone || "",
      },
      createdAt: now,
      updatedAt: now,
    };

    const putCmd = new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    });
    await dynamoDb.send(putCmd);

    // Return minimal user object (do not return password)
    const safeUser = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorVerified: user.vendorVerified,
      vendorInfo: user.vendorInfo,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ ok: true, user: safeUser, message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

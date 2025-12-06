<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/password";
import { createUser, getUserByEmail } from "@/lib/db-helpers";
import { DynamoDBUser } from "@/lib/dynamodb";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, organizationName, phoneNumber, address } =
      await request.json();

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if vendor already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "A vendor account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create vendor account
    const now = new Date().toISOString();
    const newVendor: DynamoDBUser = {
      userId: randomUUID(),
      email,
      name,
      password: hashedPassword,
      role: "vendor",
      vendorVerified: false, // Requires admin approval
      vendorInfo: {
        organizationName: organizationName || "",
        phoneNumber: phoneNumber || "",
        address: address || "",
      },
      createdAt: now,
      updatedAt: now,
    };

    await createUser(newVendor);

    // Return vendor data without password
    const { password: _, ...safeVendorData } = newVendor;

    return NextResponse.json(
      {
        message: "Vendor account created successfully. Awaiting admin verification.",
        vendor: safeVendorData,
        redirectUrl: "/dashboard",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
=======
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/password";
import { createUser, getUserByEmail } from "@/lib/db-helpers";
import { DynamoDBUser } from "@/lib/dynamodb";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, organizationName, phoneNumber, address } =
      await request.json();

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if vendor already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "A vendor account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create vendor account
    const now = new Date().toISOString();
    const newVendor: DynamoDBUser = {
      userId: randomUUID(),
      email,
      name,
      password: hashedPassword,
      role: "vendor",
      vendorVerified: false, // Requires admin approval
      vendorInfo: {
        organizationName: organizationName || "",
        phoneNumber: phoneNumber || "",
        address: address || "",
      },
      createdAt: now,
      updatedAt: now,
    };

    await createUser(newVendor);

    // Return vendor data without password
    const { password: _, ...safeVendorData } = newVendor;

    return NextResponse.json(
      {
        message: "Vendor account created successfully. Awaiting admin verification.",
        vendor: safeVendorData,
        redirectUrl: "/dashboard",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1

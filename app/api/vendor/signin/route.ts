// app/api/vendor/signin/route.ts
import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, USERS_TABLE } from "@/lib/dynamodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

type Body = {
  email?: string;
  password?: string;
};

const TOKEN_EXP_SECONDS = 60 * 60 * 24 * 7; // 7 days

async function createJwt(payload: Record<string, any>) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET not configured");

  const encoder = new TextEncoder();
  const key = encoder.encode(secret);

  // Sign with HS256
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + TOKEN_EXP_SECONDS)
    .sign(key);
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json().catch(() => ({}));
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: "Missing email or password" }, { status: 400 });
    }

    // Find user by email (Scan for now). For production create GSI on email.
    const cmd = new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
      Limit: 1,
    });
    const res = await dynamoDb.send(cmd);
    const user = (res.Items && res.Items[0]) as any | undefined;

    if (!user) {
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Compare password (bcrypt)
    if (!user.password) {
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Build token payload (small)
    const tokenPayload = {
      sub: user.userId,
      email: user.email,
      role: user.role ?? "vendor",
      name: user.name ?? "",
    };

    const token = await createJwt(tokenPayload);

    // Return token and safe user object (no password)
    const safeUser = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorVerified: user.vendorVerified,
      vendorInfo: user.vendorInfo,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ ok: true, token, vendor: safeUser });
  } catch (err) {
    console.error("Signin error:", err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

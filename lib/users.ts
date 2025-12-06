// lib/users.ts
import { dynamoDb, USERS_TABLE } from "@/lib/dynamodb";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export type DBUser = {
  userId: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  website?: string;
  passwordHash?: string; // only stored server-side
  role?: "user" | "vendor" | "admin";
  vendorVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// NOTE: This implementation uses a Scan with filter to look up email.
// For production use, create a GSI on email (recommended) and use Query.
export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const command = new ScanCommand({
    TableName: USERS_TABLE,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email },
    Limit: 1,
  });

  const resp = await dynamoDb.send(command);
  const items = resp.Items || [];
  return items.length > 0 ? (items[0] as DBUser) : null;
}

export async function createUser(payload: {
  email: string;
  password: string;
  name?: string;
  company?: string;
  phone?: string;
  website?: string;
  role?: "vendor" | "user";
}): Promise<DBUser> {
  const now = new Date().toISOString();
  const userId = randomUUID();

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user: DBUser = {
    userId,
    email: payload.email,
    name: payload.name,
    company: payload.company,
    phone: payload.phone,
    website: payload.website,
    passwordHash,
    role: payload.role ?? "vendor",
    vendorVerified: false,
    createdAt: now,
    updatedAt: now,
  };

  const command = new PutCommand({
    TableName: USERS_TABLE,
    Item: user,
    ConditionExpression: "attribute_not_exists(userId)", // best-effort
  });

  await dynamoDb.send(command);
  // remove passwordHash before returning (for security)
  const { passwordHash: _, ...safe } = user;
  return safe as DBUser;
}

export async function verifyPassword(
  email: string,
  candidatePassword: string
): Promise<DBUser | null> {
  const user = await findUserByEmail(email);
  if (!user || !user.passwordHash) return null;
  const ok = await bcrypt.compare(candidatePassword, user.passwordHash);
  if (!ok) return null;
  // return user without passwordHash
  const { passwordHash: _, ...safe } = user;
  return safe as DBUser;
}

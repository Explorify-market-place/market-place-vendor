import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUser } from "@/lib/db-helpers";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { userId } = body;

  // Verify the user is updating their own account
  if (session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await updateUser(userId, { vendorVerified: true });
    return NextResponse.json({ message: "Vendor verified successfully" });
  } catch (error) {
    console.error("Error verifying vendor:", error);
    return NextResponse.json({ error: "Failed to verify vendor" }, { status: 500 });
  }
}

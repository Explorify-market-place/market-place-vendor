import { NextRequest, NextResponse } from "next/server";
import { deleteObject } from "@/lib/s3";
import { auth } from "@/auth";

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "S3 key is required" },
        { status: 400 },
      );
    }

    // Delete from S3
    await deleteObject(key);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}

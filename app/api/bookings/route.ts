import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBookingsByUser, getBookingsByVendor } from "@/lib/db-helpers";

// GET - list bookings for current user or vendor
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get("vendorId");

    let bookings;

    if (vendorId) {
      // Vendor requesting their bookings
      if (session.user.id !== vendorId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      bookings = await getBookingsByVendor(vendorId);
    } else {
      // User requesting their bookings
      bookings = await getBookingsByUser(session.user.id);
    }

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

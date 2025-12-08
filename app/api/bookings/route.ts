import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createBooking, getBookingsByUser, getBookingsByVendor } from "@/lib/db-helpers";
import { randomUUID } from "crypto";

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

// POST - create a booking
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, dateBooked, numPeople, totalAmount } = body;

    if (!planId || !dateBooked || !numPeople || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await createBooking({
      bookingId: randomUUID(),
      userId: session.user.id,
      planId,
      dateBooked,
      numPeople: Number(numPeople),
      totalAmount: Number(totalAmount),
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}



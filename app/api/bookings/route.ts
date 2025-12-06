<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { createBooking, getBookingsByUser } from "@/lib/db-helpers";
import { randomUUID } from "crypto";

// GET - list bookings for current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await getBookingsByUser(session.user.id);
  return NextResponse.json({ bookings });
}

// POST - create a booking
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { planId, numPeople } = body;
  if (!planId || !numPeople) {
    return NextResponse.json({ error: "Missing planId or numPeople" }, { status: 400 });
  }

  const booking = await createBooking({
    bookingId: randomUUID(),
    planId,
    userId: session.user.id,
    dateBooked: new Date().toISOString(),
    numPeople: Number(numPeople),
    paymentStatus: "pending",
    totalAmount: 0,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ booking, message: "Booking created" });
}


=======
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { createBooking, getBookingsByUser } from "@/lib/db-helpers";
import { randomUUID } from "crypto";

// GET - list bookings for current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await getBookingsByUser(session.user.id);
  return NextResponse.json({ bookings });
}

// POST - create a booking
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { planId, numPeople } = body;
  if (!planId || !numPeople) {
    return NextResponse.json({ error: "Missing planId or numPeople" }, { status: 400 });
  }

  const booking = await createBooking({
    bookingId: randomUUID(),
    planId,
    userId: session.user.id,
    dateBooked: new Date().toISOString(),
    numPeople: Number(numPeople),
    paymentStatus: "pending",
    totalAmount: 0,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ booking, message: "Booking created" });
}


>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1

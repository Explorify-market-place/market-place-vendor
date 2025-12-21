import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createDeparture,
  getDeparturesByPlan,
  getPlanById,
} from "@/lib/db-helpers";
import { DynamoDBDeparture } from "@/lib/dynamodb";
import { randomUUID } from "crypto";

// GET - List departures for a specific plan
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    // Verify the plan belongs to this vendor
    const plan = await getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (plan.vendorId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to view departures for this plan" },
        { status: 403 }
      );
    }

    // Get all departures for this plan
    const departures = await getDeparturesByPlan(planId);

    // Sort by departure date (newest first)
    departures.sort(
      (a, b) =>
        new Date(b.departureDate).getTime() -
        new Date(a.departureDate).getTime()
    );

    return NextResponse.json({
      success: true,
      departures,
      count: departures.length,
    });
  } catch (error) {
    console.error("Error fetching departures:", error);
    return NextResponse.json(
      { error: "Failed to fetch departures" },
      { status: 500 }
    );
  }
}

// POST - Create a new departure
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, departureDate, pickupLocation, pickupTime, totalCapacity } =
      body;

    // Validate required fields
    if (
      !planId ||
      !departureDate ||
      !pickupLocation ||
      !pickupTime ||
      !totalCapacity
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: planId, departureDate, pickupLocation, pickupTime, totalCapacity",
        },
        { status: 400 }
      );
    }

    // Verify the plan exists and belongs to this vendor
    const plan = await getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (plan.vendorId !== session.user.id) {
      return NextResponse.json(
        {
          error: "You don't have permission to create departures for this plan",
        },
        { status: 403 }
      );
    }

    // Validate departure date is in the future
    const departureDateObj = new Date(departureDate);
    if (departureDateObj <= new Date()) {
      return NextResponse.json(
        { error: "Departure date must be in the future" },
        { status: 400 }
      );
    }

    // Validate capacity
    if (totalCapacity < 1 || totalCapacity > 100) {
      return NextResponse.json(
        { error: "Total capacity must be between 1 and 100" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const departure: DynamoDBDeparture = {
      departureId: randomUUID(),
      planId,
      departureDate,
      pickupLocation,
      pickupTime,
      totalCapacity: Number(totalCapacity),
      bookedSeats: 0,
      status: "scheduled",
      createdAt: now,
      updatedAt: now,
    };

    await createDeparture(departure);

    return NextResponse.json(
      {
        success: true,
        departure,
        message: "Departure created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating departure:", error);
    return NextResponse.json(
      { error: "Failed to create departure" },
      { status: 500 }
    );
  }
}

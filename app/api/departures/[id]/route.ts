import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getDepartureById,
  updateDeparture,
  deleteDeparture,
  getPlanById,
} from "@/lib/db-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single departure details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: departureId } = await params;
    const departure = await getDepartureById(departureId);

    if (!departure) {
      return NextResponse.json(
        { error: "Departure not found" },
        { status: 404 }
      );
    }

    // Verify the departure's plan belongs to this vendor
    const plan = await getPlanById(departure.planId);
    if (!plan || plan.vendorId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to view this departure" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      departure,
    });
  } catch (error) {
    console.error("Error fetching departure:", error);
    return NextResponse.json(
      { error: "Failed to fetch departure" },
      { status: 500 }
    );
  }
}

// PUT - Update departure details
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: departureId } = await params;
    const departure = await getDepartureById(departureId);

    if (!departure) {
      return NextResponse.json(
        { error: "Departure not found" },
        { status: 404 }
      );
    }

    // Verify the departure's plan belongs to this vendor
    const plan = await getPlanById(departure.planId);
    if (!plan || plan.vendorId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this departure" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { departureDate, pickupLocation, pickupTime, totalCapacity, status } =
      body;

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (departureDate !== undefined) {
      // Validate departure date is in the future
      const departureDateObj = new Date(departureDate);
      if (departureDateObj <= new Date()) {
        return NextResponse.json(
          { error: "Departure date must be in the future" },
          { status: 400 }
        );
      }
      updates.departureDate = departureDate;
    }

    if (pickupLocation !== undefined) {
      updates.pickupLocation = pickupLocation;
    }

    if (pickupTime !== undefined) {
      updates.pickupTime = pickupTime;
    }

    if (totalCapacity !== undefined) {
      const newCapacity = Number(totalCapacity);

      // Validate capacity range
      if (newCapacity < 1 || newCapacity > 100) {
        return NextResponse.json(
          { error: "Total capacity must be between 1 and 100" },
          { status: 400 }
        );
      }

      // Prevent reducing capacity below current bookings
      if (newCapacity < departure.bookedSeats) {
        return NextResponse.json(
          {
            error: `Cannot reduce capacity below current bookings (${departure.bookedSeats})`,
          },
          { status: 400 }
        );
      }

      updates.totalCapacity = newCapacity;
    }

    if (status !== undefined) {
      if (
        !["scheduled", "confirmed", "cancelled", "completed"].includes(status)
      ) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    await updateDeparture(departureId, updates);

    const updatedDeparture = await getDepartureById(departureId);

    return NextResponse.json({
      success: true,
      departure: updatedDeparture,
      message: "Departure updated successfully",
    });
  } catch (error) {
    console.error("Error updating departure:", error);
    return NextResponse.json(
      { error: "Failed to update departure" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/delete departure
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: departureId } = await params;
    const departure = await getDepartureById(departureId);

    if (!departure) {
      return NextResponse.json(
        { error: "Departure not found" },
        { status: 404 }
      );
    }

    // Verify the departure's plan belongs to this vendor
    const plan = await getPlanById(departure.planId);
    if (!plan || plan.vendorId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this departure" },
        { status: 403 }
      );
    }

    // Prevent deletion if there are bookings
    // TODO: PROMPT VENDOR are you sure you want to delete
    // existing bookings? this will cancel all bookings and notify users and inititate user refund.
    // For now, just block deletion if bookings exist. later refund logic can be added.
    if (departure.bookedSeats > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete departure with existing bookings (${departure.bookedSeats} seats booked)`,
        },
        { status: 400 }
      );
    }

    await deleteDeparture(departureId);

    return NextResponse.json({
      success: true,
      message: "Departure deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting departure:", error);
    return NextResponse.json(
      { error: "Failed to delete departure" },
      { status: 500 }
    );
  }
}

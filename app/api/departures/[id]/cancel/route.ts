import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getDepartureById,
  updateDeparture,
  getBookingsByPlan,
  updateBooking,
  getPlanById,
} from "@/lib/db-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only vendors can cancel departures
    if (session.user.role !== "vendor") {
      return NextResponse.json(
        { error: "Only vendors can cancel departures" },
        { status: 403 }
      );
    }

    const { id: departureId } = await params;
    const { reason } = await request.json();

    // Get departure details
    const departure = await getDepartureById(departureId);
    if (!departure) {
      return NextResponse.json(
        { error: "Departure not found" },
        { status: 404 }
      );
    }

    // Get plan to verify vendor ownership
    const plan = await getPlanById(departure.planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Travel plan not found" },
        { status: 404 }
      );
    }

    // Verify vendor owns this plan
    if (plan.vendorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only cancel your own departures" },
        { status: 403 }
      );
    }

    // Check if departure is already cancelled
    if (!departure.isActive) {
      return NextResponse.json(
        { error: "Departure is already cancelled" },
        { status: 400 }
      );
    }

    // Check if departure is in the past
    const departureDate = new Date(departure.departureDate);
    const now = new Date();
    if (departureDate < now) {
      return NextResponse.json(
        { error: "Cannot cancel past departures" },
        { status: 400 }
      );
    }

    // Get all bookings for this departure
    const allBookings = await getBookingsByPlan(departure.planId);
    const departureBookings = allBookings.filter(
      (booking) =>
        booking.departureId === departureId &&
        booking.bookingStatus === "confirmed" &&
        booking.paymentStatus === "completed"
    );

    console.log(
      `Found ${departureBookings.length} bookings to refund for departure ${departureId}`
    );

    // Process refunds for all bookings
    const refundResults = {
      total: departureBookings.length,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const booking of departureBookings) {
      try {
        // Calculate full tripCost refund (100% - vendor cancellation)
        const refundAmount = booking.tripCost;
        const refundPercentage = 100;

        // Call user platform's refund API (different server)
        const userPlatformUrl =
          process.env.USER_PLATFORM_URL || "http://localhost:3000";
        const refundResponse = await fetch(
          `${userPlatformUrl}/api/payments/refund`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingId: booking.bookingId,
              vendorCancellation: true,
              vendorId: session.user.id,
            }),
          }
        );

        if (!refundResponse.ok) {
          const errorData = await refundResponse.json();
          throw new Error(errorData.error || "Refund API failed");
        }

        // Update booking locally with vendor cancellation details
        await updateBooking(booking.bookingId, {
          bookingStatus: "cancelled",
          refundStatus: "processing",
          refundPercentage,
          refundAmount,
          vendorPayoutAmount: 0, // Vendor gets nothing - their fault
          cancelledAt: new Date().toISOString(),
          cancellationReason: `Vendor cancelled departure: ${
            reason || "No reason provided"
          }`,
        });

        refundResults.successful++;
        console.log(`Successfully refunded booking ${booking.bookingId}`);
      } catch (error) {
        refundResults.failed++;
        const errorMsg = `Failed to refund booking ${booking.bookingId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        console.error(errorMsg);
        refundResults.errors.push(errorMsg);
      }
    }

    // Mark departure as cancelled
    await updateDeparture(departureId, {
      status: "cancelled",
      isActive: false,
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason || "Vendor cancelled departure",
    });

    // Return results
    return NextResponse.json(
      {
        success: true,
        message: "Departure cancelled successfully",
        departureId,
        refundResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling departure:", error);
    return NextResponse.json(
      {
        error: "Failed to cancel departure",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/users";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin permissions
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const subscriptionId = id;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    // Update the manual subscription status to "cancelled"
    const updatedSubscription = await prisma.manualSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: "cancelled",
      },
    });

    if (!updatedSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, subscription: updatedSubscription },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling manual subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}

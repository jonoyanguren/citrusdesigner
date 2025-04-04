import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/users";
import { stripe } from "@/lib/stripe";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin permissions
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Cancel differently based on type (manual or Stripe)
    if (subscription.stripeUserId === "manual") {
      // For manual subscriptions, just update status
      await prisma.subscription.update({
        where: { id },
        data: { status: "canceled" },
      });
    } else {
      // For Stripe subscriptions, cancel in Stripe
      try {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      } catch (stripeError) {
        console.error("Stripe cancellation error:", stripeError);
        // Continue anyway to update local DB
      }

      // Update in database
      await prisma.subscription.update({
        where: { id },
        data: { status: "canceled" },
      });
    }

    return NextResponse.json({
      message: "Subscription canceled successfully",
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}

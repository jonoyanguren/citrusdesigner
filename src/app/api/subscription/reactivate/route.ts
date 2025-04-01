import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { stripe } from "@/lib/stripe";
import { verifyToken } from "@/lib/users";

export async function POST(request: Request) {
  try {
    const session = await verifyToken();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId, locale } = await request.json();
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (!subscription || subscription.status !== "canceled") {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    const priceId = subscription.items.data[0]?.price.id;
    const customerId = subscription.customer as string;

    if (!priceId || !customerId) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    const { sessionId } = await createCheckoutSession(
      priceId,
      customerId,
      locale
    );

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return NextResponse.json(
      { error: "Error reactivating subscription" },
      { status: 500 }
    );
  }
}

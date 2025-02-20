import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createSubscription } from "./createSubscription";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("⚠️ No stripe signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("⚠️ No webhook secret found");
      return NextResponse.json(
        { error: "No webhook secret configured" },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription;
        console.info("📦 Subscription created:", subscription.id);
        break;

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.info("📦 Subscription updated:", updatedSubscription.id);
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.info("📦 Subscription deleted:", deletedSubscription.id);
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.billing_reason === "subscription_create") {
          try {
            await createSubscription(invoice);
            console.info("✅ Subscription created:");
          } catch (error) {
            console.error("❌ Error creating subscription:", error);
          }
        }
        break;

      default:
        console.info(`🤔 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

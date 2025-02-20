import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function GET(
  request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;

    const session = (await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription.plan.product"],
    })) as Stripe.Checkout.Session;

    return NextResponse.json({
      customer: {
        email:
          session.customer_email || (session.customer as Stripe.Customer).email,
        name: (session.customer as Stripe.Customer).name,
      },
      subscription: {
        plan: {
          product: {
            name: (session.subscription as Stripe.Subscription).plan?.product
              ?.name,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json(
      { error: "Error retrieving session" },
      { status: 500 }
    );
  }
}

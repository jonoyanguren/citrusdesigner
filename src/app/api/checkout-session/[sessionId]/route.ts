import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await stripe.checkout.sessions.retrieve(params.sessionId, {
      expand: ["customer", "subscription.plan.product"],
    });

    return NextResponse.json({
      customer: {
        email: session.customer_email || (session.customer as any)?.email,
        name: (session.customer as any)?.name,
      },
      subscription: {
        plan: {
          product: {
            name: (session.subscription as any)?.plan?.product?.name,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: "Error retrieving session" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { priceId, locale } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    const { sessionId } = await createCheckoutSession(
      priceId,
      undefined,
      locale
    );
    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}

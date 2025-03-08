import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/stripe";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

async function getActiveSubscriptionsCount() {
  try {
    const subscriptions = await stripe.subscriptions.list({
      status: "active",
      limit: 100, // Ajusta este límite según tus necesidades
    });
    return subscriptions.data.length;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const activeSubscriptions = await getActiveSubscriptionsCount();
    const maxProjects = parseInt(process.env.MAX_PROJECTS || "10");

    if (activeSubscriptions >= maxProjects) {
      return NextResponse.json({
        waitlist: true,
        message: "We are currently at capacity. Please join our waitlist.",
        activeSubscriptions,
        maxProjects,
      });
    }

    const products = await getActiveProducts();
    return NextResponse.json({
      waitlist: false,
      products,
      activeSubscriptions,
      maxProjects,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

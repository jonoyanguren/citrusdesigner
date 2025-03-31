import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/stripe";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
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

async function getMaxProjects() {
  const maxProjects = 10;
  try {
    const config = await prisma.configuration.findUnique({
      where: { key: "MAX_PROJECTS" },
    });

    if (!config) {
      console.log("MAX_PROJECTS config not found, returning default value");
      return maxProjects;
    }

    // Convert value to integer
    const value = parseInt(config.value, 10);
    if (isNaN(value)) {
      console.log("Invalid MAX_PROJECTS value, returning default value");
      return maxProjects;
    }

    return value;
  } catch (error) {
    console.error("Error fetching max projects:", error);
    return maxProjects; // Default value if there's an error
  }
}

export async function GET() {
  try {
    const [activeSubscriptions, maxProjects] = await Promise.all([
      getActiveSubscriptionsCount(),
      getMaxProjects(),
    ]);

    console.log("activeSubscriptions", activeSubscriptions);
    console.log("maxProjects", maxProjects);
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

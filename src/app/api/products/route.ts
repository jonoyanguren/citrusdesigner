import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/stripe";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

async function getActiveSubscriptionsCount() {
  try {
    let allSubscriptions: Stripe.Subscription[] = [];
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const subscriptions: Stripe.Response<
        Stripe.ApiList<Stripe.Subscription>
      > = await stripe.subscriptions.list({
        status: "active",
        limit: 100,
        starting_after: startingAfter,
      });

      allSubscriptions = [...allSubscriptions, ...subscriptions.data];

      if (subscriptions.has_more) {
        startingAfter = subscriptions.data[subscriptions.data.length - 1].id;
      } else {
        hasMore = false;
      }
    }

    // Get active manual subscriptions count
    const manualSubscriptionsCount = await prisma.manualSubscription.count({
      where: {
        status: "active",
      },
    });

    return allSubscriptions.length + manualSubscriptionsCount;
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
      console.info("MAX_PROJECTS config not found, returning default value");
      return maxProjects;
    }

    // Convert value to integer
    const value = parseInt(config.value, 10);
    if (isNaN(value)) {
      console.info("Invalid MAX_PROJECTS value, returning default value");
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

    const products = await getActiveProducts();

    return NextResponse.json({
      waitlist: activeSubscriptions >= maxProjects,
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

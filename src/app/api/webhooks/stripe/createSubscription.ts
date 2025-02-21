import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";
import { hashSync } from "bcrypt";

export async function createSubscription(invoice: Stripe.Invoice) {
  try {
    if (!invoice.customer_email) {
      throw new Error("No customer email found");
    }

    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
      {
        expand: ["items.data.price.product", "customer"],
      }
    );

    let user = await prisma.user.findUnique({
      where: { email: invoice.customer_email },
    });

    // If user not found, create new user
    if (!user?.id) {
      console.info("User not found, creating new user", invoice.customer_email);
      const newUser = await prisma.user.create({
        data: {
          email: invoice.customer_email,
          name: invoice.customer_email.split("@")[0],
          password: hashSync("Password123", 10),
          hasToChangePassword: true,
        },
      });

      user = newUser;
    }

    // Create new subscription
    console.info("Creating new subscription for user", user.email);
    const data = {
      stripeSubscriptionId: subscription.id,
      stripeUserId: invoice.customer as string,
      userId: user.id,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      productId: (subscription.items.data[0].price.product as Stripe.Product)
        .id,
    };

    const newSubscription = await prisma.subscription.create({ data });
    return newSubscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

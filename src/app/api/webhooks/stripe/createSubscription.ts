import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";
import { hashSync } from "bcrypt";

export async function createSubscription(invoice: Stripe.Invoice) {
  try {
    if (!invoice.customer) {
      throw new Error("No customer found in invoice");
    }

    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string,
      {
        expand: ["items.data.price.product", "customer"],
      }
    );

    let user = await prisma.user.findFirst({
      where: {
        subscriptions: {
          some: {
            stripeUserId: invoice.customer as string,
          },
        },
      },
    });

    if (!user && invoice.customer_email) {
      user = await prisma.user.findUnique({
        where: { email: invoice.customer_email },
      });

      if (!user?.id) {
        console.info(
          "User not found, creating new user",
          invoice.customer_email
        );
        user = await prisma.user.create({
          data: {
            email: invoice.customer_email,
            name: invoice.customer_email.split("@")[0],
            password: hashSync("Password123", 10),
            hasToChangePassword: true,
          },
        });
      }
    }

    if (!user) {
      throw new Error("No se pudo encontrar o crear el usuario");
    }

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

    // Crear nueva suscripción
    console.log("Creating new subscription with data:", data);
    const newSubscription = await prisma.subscription.create({ data });
    console.log("Subscription created:", newSubscription);

    return newSubscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

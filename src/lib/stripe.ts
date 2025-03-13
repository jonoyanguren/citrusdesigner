import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const prisma = new PrismaClient();

if (!stripeSecretKey) {
  console.error("⚠️ STRIPE_SECRET_KEY is not defined in environment variables");
}

export const stripe = new Stripe(stripeSecretKey || "fallback_key", {
  apiVersion: "2025-01-27.acacia",
});

export interface StripeProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  priceId: string;
  features: string[];
  interval: string;
}

export async function getActiveProducts(): Promise<StripeProduct[]> {
  try {
    // Obtener todos los productos activos
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Mapear los productos a nuestro formato
    const formattedProducts = products.data
      .filter((product) => product.default_price)
      .map((product) => {
        const price = product.default_price as Stripe.Price;
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          priceId: typeof price === "string" ? price : price.id,
          features: product.metadata.features
            ? JSON.parse(product.metadata.features)
            : [],
          interval: price.recurring?.interval || "month",
        };
      });

    return formattedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  locale: string = "es"
) {
  if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not configured");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/${locale}/pricing`,
      customer: customerId,
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function createPortalSession(customerId: string) {
  if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not configured");
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_URL}/account`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    // Primero obtenemos la suscripción de nuestra base de datos para obtener el stripeSubscriptionId
    const dbSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!dbSubscription?.stripeSubscriptionId) {
      throw new Error("No se encontró el ID de suscripción de Stripe");
    }

    // Ahora obtenemos los detalles de la suscripción desde Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      dbSubscription.stripeSubscriptionId,
      {
        expand: ["default_payment_method", "items.data.price.product"],
      }
    );

    return stripeSubscription;
  } catch (error) {
    console.error("Error getting subscription:", error);
    throw error;
  }
}

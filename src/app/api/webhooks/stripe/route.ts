import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createSubscription } from "./createSubscription";
import { emailTemplates } from "@/lib/email-templates";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { LocaleType } from "@/types/locale";

export async function POST(request: NextRequest) {
  try {
    console.info("🔔 Stripe webhook received");
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
      case "checkout.session.completed":
        console.info("🔔 Processing checkout.session.completed");
        const session = event.data.object as Stripe.Checkout.Session;
        const checkoutLocale = session.metadata?.locale as string;

        if (!checkoutLocale) {
          console.error("⚠️ No locale found in checkout session metadata");
          return NextResponse.json(
            { error: "No locale found" },
            { status: 400 }
          );
        }

        if (session.mode === "subscription") {
          const invoice = await stripe.invoices.retrieve(
            session.invoice as string
          );

          // Verificar si la suscripción ya existe
          const existingSubscription = await prisma.subscription.findUnique({
            where: {
              stripeSubscriptionId: invoice.subscription as string,
            },
          });

          if (existingSubscription) {
            console.info("🔔 Subscription already exists, skipping creation");
            return NextResponse.json({ received: true });
          }

          await createSubscription(invoice, checkoutLocale);
          console.info("✅ Subscription created from checkout session");
        }
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.info("📦 Subscription deleted:", deletedSubscription.id);

        const user = await prisma.user.findFirst({
          where: {
            subscriptions: {
              some: {
                stripeSubscriptionId: deletedSubscription.id,
              },
            },
          },
        });

        if (user) {
          const endDate = new Date(
            deletedSubscription.current_period_end * 1000
          );
          const { html, text, subject } =
            await emailTemplates.generateSubscriptionCancelledEmail({
              endDate,
              locale: deletedSubscription.metadata?.locale as LocaleType,
            });

          await sendEmail({
            to: user.email,
            subject,
            html,
            text,
          });
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

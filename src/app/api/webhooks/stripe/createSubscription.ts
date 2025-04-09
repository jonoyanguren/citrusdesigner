import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";
import { hashSync } from "bcrypt";
import { emailTemplates } from "@/lib/email-templates";
import { sendEmail } from "@/lib/email";
import { LocaleType } from "@/types/locale";
import { User } from "@prisma/client";

const sendWelcomeEmail = async (
  user: User,
  temporaryPassword: string,
  locale: LocaleType
) => {
  const { html, text, subject } = emailTemplates.generateWelcomeEmail({
    userEmail: user.email,
    temporaryPassword,
    locale: locale as LocaleType,
  });

  await sendEmail({
    to: user.email,
    subject,
    html,
    text,
  });
};

const sendSubscriptionConfirmationEmail = async (
  user: User,
  locale: LocaleType
) => {
  const { html, text, subject } =
    emailTemplates.generateSubscriptionConfirmationEmail({
      userEmail: user.email,
      locale: locale as LocaleType,
    });

  await sendEmail({
    to: user.email,
    subject,
    html,
    text,
  });
};

export async function createSubscription(
  invoice: Stripe.Invoice,
  locale: string
) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
    {
      expand: ["items.data.price.product"],
    }
  );

  // Primero verificar si la suscripción ya existe
  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  });

  if (existingSubscription) {
    console.info("🔔 Subscription already exists, skipping creation");
    console.info("🔔 Existing subscription details:", {
      id: existingSubscription.id,
      status: existingSubscription.status,
      createdAt: existingSubscription.createdAt,
    });
    return existingSubscription;
  }

  let user = await prisma.user.findFirst({
    where: {
      subscriptions: {
        some: {
          stripeSubscriptionId: subscription.id,
        },
      },
    },
  });

  let isNewUser = false;

  if (!user && invoice.customer_email) {
    console.info("🔔 User not found, searching by email");
    user = await prisma.user.findUnique({
      where: { email: invoice.customer_email },
    });

    if (!user?.id) {
      console.info(
        "🔔 User not found, creating new user",
        invoice.customer_email
      );
      // Generar una contraseña temporal
      const temporaryPassword = Math.random().toString(36).slice(-8);

      user = await prisma.user.create({
        data: {
          email: invoice.customer_email,
          name: invoice.customer_email.split("@")[0],
          password: hashSync(temporaryPassword, 10),
          hasToChangePassword: true,
        },
      });

      console.info("🔔 New user created with ID:", user.id);
      isNewUser = true;
      await sendWelcomeEmail(user, temporaryPassword, locale as LocaleType);
      console.info("🔔 Welcome email sent successfully");
    } else {
      console.info("🔔 Found existing user with ID:", user.id);
    }
  }

  if (!user) {
    throw new Error("No se pudo encontrar o crear el usuario");
  }

  console.info("🔔 Creating new subscription for user", user.email);
  const data = {
    stripeSubscriptionId: subscription.id,
    stripeUserId: invoice.customer as string,
    userId: user.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    productId: (subscription.items.data[0].price.product as Stripe.Product).id,
  };

  // Actualizar metadata de la suscripción
  await stripe.subscriptions.update(subscription.id, {
    metadata: { locale },
  });

  const newSubscription = await prisma.subscription.create({ data });
  console.info("🔔 Subscription created:", {
    id: newSubscription.id,
    status: newSubscription.status,
    createdAt: newSubscription.createdAt,
  });

  // Si no es un usuario nuevo, enviar email de confirmación de suscripción
  if (!isNewUser) {
    await sendSubscriptionConfirmationEmail(user, locale as LocaleType);
    console.info(
      "🔔 Subscription confirmation email sent successfully to: ",
      user.email
    );
  }

  return newSubscription;
}

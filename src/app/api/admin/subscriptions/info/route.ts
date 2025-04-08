import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { isAdmin } from "@/lib/users";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Verificar permisos de administrador
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Extraer el ID de la suscripción de la URL
    const url = new URL(request.url);
    const stripeId = url.searchParams.get("stripeId");

    if (!stripeId) {
      return NextResponse.json(
        { error: "Se requiere el ID de la suscripción" },
        { status: 400 }
      );
    }

    // Obtener la suscripción de la base de datos
    const subscription = await prisma.subscription.findUnique({
      where: { id: stripeId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Suscripción no encontrada" },
        { status: 404 }
      );
    }

    // Si es una suscripción manual, no necesitamos consultar Stripe
    if (subscription.stripeUserId === "manual") {
      return NextResponse.json({
        planName: "Manual Subscription",
      });
    }

    // Para suscripciones de Stripe, obtener los detalles desde Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
      {
        expand: ["items.data.price.product"],
      }
    );

    // Extraer el nombre del producto y el precio
    const priceData = stripeSubscription.items.data[0]?.price;
    const product = priceData?.product;
    let planName = "Unknown Plan";
    let price = 0;
    let currency = "EUR";
    let interval = "month";

    if (product && typeof product !== "string" && "name" in product) {
      planName = product.name;
    }

    if (priceData) {
      price = priceData.unit_amount ? priceData.unit_amount / 100 : 0;
      currency = priceData.currency.toUpperCase();

      if (priceData.recurring) {
        interval = priceData.recurring.interval || "month";
      }
    }

    // Format the price according to locale
    const formattedNumber = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    // Translate interval for display
    const intervalDisplay =
      interval === "year" ? "year" : interval === "month" ? "month" : "day";

    return NextResponse.json({
      planName,
      productId: subscription.productId,
      price,
      currency,
      interval,
      formattedPrice: `${formattedNumber}/${intervalDisplay}`,
    });
  } catch (error) {
    console.error("Error obteniendo información de suscripción:", error);
    return NextResponse.json(
      { error: "Error obteniendo detalles de la suscripción" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { verifyToken } from "@/lib/users";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json(
        { error: "No token provided or not valid" },
        { status: 401 }
      );
    }

    // Primero verificamos que la suscripción pertenece al usuario
    const dbSubscription = await prisma.subscription.findUnique({
      where: {
        id: id,
        userId: decodedToken.userId,
      },
    });

    if (!dbSubscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "Suscripción no encontrada" },
        { status: 404 }
      );
    }

    // Obtenemos los detalles de Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      dbSubscription.stripeSubscriptionId,
      {
        expand: ["default_payment_method", "items.data.price.product"],
      }
    );

    return NextResponse.json(stripeSubscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Error al obtener la suscripción" },
      { status: 500 }
    );
  }
}

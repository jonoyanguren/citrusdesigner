import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/users";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const decodedToken = await verifyToken();
    const body = await request.json();
    const locale = body.locale || "es";

    if (!decodedToken) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener la suscripción del usuario
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      include: { subscriptions: true },
    });

    const subscription = user?.subscriptions.find(
      (subscription) => subscription.status === "active"
    );

    if (!subscription) {
      return NextResponse.json(
        { error: "No se encontró una suscripción activa" },
        { status: 404 }
      );
    }

    // Actualizar metadata de la suscripción
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      metadata: { locale },
    });

    // Cancelar la suscripción en Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Actualizar el estado en la base de datos
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "canceled" },
    });

    return NextResponse.json({ message: "Suscripción cancelada con éxito" });
  } catch (error) {
    console.error("Error al cancelar la suscripción:", error);
    return NextResponse.json(
      { error: "Error al cancelar la suscripción" },
      { status: 500 }
    );
  }
}

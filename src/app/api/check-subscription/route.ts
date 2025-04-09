import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/users";
import { checkActiveSubscription } from "@/lib/subscription";

export async function GET() {
  try {
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json({ error: "Token no válido" }, { status: 401 });
    }

    const hasActiveSubscription = await checkActiveSubscription(
      decodedToken.userId
    );

    if (!hasActiveSubscription) {
      return NextResponse.json(
        { hasActiveSubscription: false },
        { status: 403 }
      );
    }

    return NextResponse.json({ hasActiveSubscription: true });
  } catch (error) {
    console.error("Error al verificar la suscripción:", error);
    return NextResponse.json(
      { error: "Error al verificar la suscripción" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { verifyToken } from "@/lib/users";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json(
        { error: "No token provided or not valid" },
        { status: 401 }
      );
    }

    // Obtener el usuario con sus suscripciones
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      include: { subscriptions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Obtener todos los stripeUserIds únicos
    const stripeUserIds = [
      ...new Set(user.subscriptions.map((sub) => sub.stripeUserId)),
    ];

    if (stripeUserIds.length === 0) {
      return NextResponse.json([]);
    }

    // Obtener todas las facturas para cada stripeUserId
    const allInvoicesPromises = stripeUserIds.map((customerId) =>
      stripe.invoices.list({
        customer: customerId,
        limit: 100,
      })
    );

    const allInvoicesResponses = await Promise.all(allInvoicesPromises);
    const allInvoices = allInvoicesResponses.flatMap(
      (response) => response.data
    );

    // Formatear las facturas para el frontend y ordenarlas por fecha
    const formattedInvoices = allInvoices
      .map((invoice) => ({
        id: invoice.id,
        number: invoice.number,
        amount_paid: invoice.amount_paid,
        status: invoice.status,
        created: invoice.created,
        invoice_pdf: invoice.invoice_pdf,
        currency: invoice.currency,
        subscription_name:
          invoice.lines.data[0]?.description || "Unknown subscription",
      }))
      .sort((a, b) => b.created - a.created); // Ordenar por fecha, más recientes primero

    return NextResponse.json(formattedInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Error fetching invoices" },
      { status: 500 }
    );
  }
}

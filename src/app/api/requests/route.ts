import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { addNotification } from "@/lib/notifications";
import { checkActiveSubscription } from "@/lib/subscription";

export async function POST(body: Request) {
  try {
    const { name, request, userId, deliverable } = await body.json();
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json({ error: "Token no válido" }, { status: 401 });
    }

    if (!userId) {
      const hasActiveSubscription = await checkActiveSubscription(
        decodedToken.userId
      );
      if (!hasActiveSubscription) {
        return NextResponse.json(
          { error: "Necesitas una suscripción activa para crear peticiones" },
          { status: 403 }
        );
      }
    }

    if (userId && decodedToken.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos para crear peticiones" },
        { status: 403 }
      );
    }

    const nuevaPeticion = await prisma.request.create({
      data: {
        name,
        request,
        userId: userId || decodedToken.userId,
        deliverable,
      },
    });

    if (deliverable && !userId) {
      await prisma.user.update({
        where: { id: decodedToken.userId },
        data: { preferDeliverable: deliverable },
      });
    }

    if (userId) {
      await addNotification({
        userId: userId,
        title: "Te han asignado una nueva petición",
        message: "El admin te ha creado una nueva petición",
        action: `/dashboard/requests/${nuevaPeticion.id}`,
      });
    } else {
      const adminUser = await prisma.user.findFirst({
        where: {
          role: "admin",
        },
      });
      if (adminUser) {
        await addNotification({
          userId: adminUser.id,
          title: "Nueva petición",
          message: "Del usuario " + decodedToken.email,
          action: `/dashboard/requests/${nuevaPeticion.id}`,
        });
      }
    }

    return NextResponse.json(nuevaPeticion);
  } catch (error) {
    console.error("Error al crear la petición:", error);
    return NextResponse.json(
      { error: "Error al crear la petición" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json({ error: "Token no válido" }, { status: 401 });
    }

    const requests = await prisma.request.findMany({
      where: {
        userId: decodedToken.userId,
      },
      include: {
        feedback: true,
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error al obtener las peticiones:", error);
    return NextResponse.json(
      { error: "Error al obtener las peticiones" },
      { status: 500 }
    );
  }
}

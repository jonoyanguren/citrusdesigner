import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { addNotification } from "@/lib/notifications";

export async function POST(body: Request) {
  try {
    const { name, request, userId } = await body.json();
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json({ error: "Token no válido" }, { status: 401 });
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
      },
    });

    if (userId) {
      await addNotification(
        userId,
        "Te han asignado una nueva petición",
        "El admin te ha creado una nueva petición"
      );
    } else {
      const adminUser = await prisma.user.findFirst({
        where: {
          role: "admin",
        },
      });
      if (adminUser) {
        await addNotification(
          adminUser.id,
          "Nueva petición",
          "Del usuario " + decodedToken.email
        );
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

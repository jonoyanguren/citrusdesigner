import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/users";

export async function GET() {
  try {
    const adminCheck = await isAdmin();

    if (!adminCheck) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Obtener todos los usuarios que tienen suscripciones manuales activas
    const users = await prisma.user.findMany({
      where: {
        manualSubscriptions: {
          some: {
            status: "active",
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        manualSubscriptions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(
      "Error obteniendo usuarios con suscripciones manuales:",
      error
    );
    return NextResponse.json(
      { error: "Error al obtener usuarios con suscripciones manuales" },
      { status: 500 }
    );
  }
}

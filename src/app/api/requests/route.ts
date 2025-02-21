import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";

export async function POST(body: Request) {
  try {
    const { name, request, createdAt } = await body.json();
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json({ error: "Token no válido" }, { status: 401 });
    }

    const nuevaPeticion = await prisma.request.create({
      data: {
        name,
        request,
        userId: decodedToken.userId,
        createdAt,
      },
    });

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

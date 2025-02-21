import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyToken();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { feedback } = await request.json();

    if (!feedback?.trim()) {
      return NextResponse.json(
        { error: "El feedback es requerido" },
        { status: 400 }
      );
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        feedback,
        requestId: params.id,
        userId: session.userId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(newFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Error al crear el feedback" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const feedback = await prisma.feedback.findMany({
      where: {
        requestId: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error al obtener el feedback:", error);
    return NextResponse.json(
      { error: "Error al obtener el feedback" },
      { status: 500 }
    );
  }
}

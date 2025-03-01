import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { addNotification } from "@/lib/notifications";

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

    const [requestData, adminUser] = await Promise.all([
      prisma.request.findUnique({
        where: { id: params.id },
        select: { userId: true, name: true },
      }),
      prisma.user.findFirst({
        where: { role: "admin" },
      }),
    ]);

    if (!requestData || !adminUser) {
      throw new Error("No se encontró la request o el usuario admin");
    }

    if (session.role === "admin") {
      await addNotification({
        userId: requestData.userId,
        title: "Has recibido un feedback",
        message:
          "En la petición " + requestData.name + " has recibido un feedback",
        action: `/dashboard/requests/${params.id}`,
      });
    } else {
      await addNotification({
        userId: adminUser.id,
        title: "Has recibido un feedback",
        message:
          "En la petición " + requestData.name + " has recibido un feedback",
        action: `/admin/requests/${params.id}`,
      });
    }

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

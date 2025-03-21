import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { statusMessages } from "@/constants/messages";
import { addNotification } from "@/lib/notifications";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await verifyToken();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { status, timeToComplete, figmaUrl } = await request.json();

    const updatedRequest = await prisma.request.update({
      where: { id },
      include: { user: true },
      data: {
        status,
        timeToComplete,
        figmaUrl,
      },
    });

    await addNotification({
      userId: updatedRequest.userId,
      title: "Actualización de solicitud",
      message: `Tu solicitud "${updatedRequest.name}" ${
        statusMessages[status as keyof typeof statusMessages]
      }${timeToComplete ? `. Tiempo estimado: ${timeToComplete}` : ""}`,
      action: `/dashboard/requests/${id}`,
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Error updating request" },
      { status: 500 }
    );
  }
}

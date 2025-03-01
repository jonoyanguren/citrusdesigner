import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { statusMessages } from "@/constants/messages";
import { addNotification } from "@/lib/notifications";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyToken();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { status, timeToComplete, figmaUrl } = await request.json();
    const requestId = params.id;

    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
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
      action: `/dashboard/requests/${requestId}`,
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

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
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

    const metadata = {
      name: updatedRequest.name,
      status: status,
      timeToComplete,
    };

    await addNotification({
      userId: updatedRequest.userId,
      type: "REQUEST_STATUS_UPDATED",
      metadata: JSON.stringify(metadata),
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

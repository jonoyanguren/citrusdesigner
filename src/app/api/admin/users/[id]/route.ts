import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/users";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const adminCheck = await isAdmin();

    if (!adminCheck) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        subscriptions: true,
        manualSubscriptions: true,
        requests: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            feedback: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error getting users:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

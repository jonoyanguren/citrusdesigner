import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin, verifyToken } from "@/lib/users";

export async function GET() {
  try {
    const session = await verifyToken();

    if (!session) {
      return new NextResponse("Unauthorized - No session", { status: 401 });
    }

    const userIsAdmin = await isAdmin();

    if (!userIsAdmin) {
      return new NextResponse("Unauthorized - Not admin", { status: 401 });
    }

    const requests = await prisma.request.findMany({
      where: {
        user: {
          OR: [
            {
              subscriptions: {
                some: {
                  status: "active",
                },
              },
            },
            {
              manualSubscriptions: {
                some: {
                  status: "active",
                },
              },
            },
          ],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error en GET /api/admin/requests:", error);

    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

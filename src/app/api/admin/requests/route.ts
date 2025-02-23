import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin, verifyToken } from "@/lib/users";

export async function GET() {
  try {
    // Obtener la sesión primero
    const session = await verifyToken();

    if (!session) {
      return new NextResponse("Unauthorized - No session", { status: 401 });
    }

    console.log("Iniciando verificación de admin...");
    const userIsAdmin = await isAdmin();
    console.log("Resultado de verificación admin:", userIsAdmin);

    if (!userIsAdmin) {
      console.log("Usuario no autorizado");
      return new NextResponse("Unauthorized - Not admin", { status: 401 });
    }

    const requests = await prisma.request.findMany({
      where: {
        seenByAdmin: false,
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

    console.log("Requests encontrados:", requests.length);
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error detallado en GET /api/admin/requests:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

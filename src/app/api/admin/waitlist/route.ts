import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";

export async function GET() {
  try {
    // Obtener todas las entradas de la lista de espera
    const session = await verifyToken();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const isAdmin = session?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Obtener todas las entradas de la lista de espera
    const entries = await prisma.waitlistEntry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return NextResponse.json(
      { error: "Error fetching waitlist" },
      { status: 500 }
    );
  }
}

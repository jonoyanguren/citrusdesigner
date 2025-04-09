import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const activeNonAdminUsers = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            status: {
              in: ["active", "ENDING_AT_PERIOD_END"],
            },
          },
        },
        role: {
          not: "admin",
        },
      },
    });
    return NextResponse.json(activeNonAdminUsers);
  } catch (error) {
    console.error("Error fetching active non-admin users:", error);
    return NextResponse.json(
      { error: "Error fetching active non-admin users" },
      { status: 500 }
    );
  }
}

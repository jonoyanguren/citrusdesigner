import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/users";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await verifyToken();

    if (!session || !session.userId) {
      return NextResponse.json({ hasActiveSubscription: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        subscriptions: {
          where: {
            status: "active",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ hasActiveSubscription: false });
    }

    const hasActiveSubscription = user?.subscriptions.length > 0;

    return NextResponse.json({ hasActiveSubscription });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ hasActiveSubscription: false });
  }
}

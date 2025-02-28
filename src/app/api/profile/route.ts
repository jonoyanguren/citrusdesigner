import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { getSubscription } from "@/lib/stripe";
export async function GET() {
  try {
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json(
        { error: "No token provided or not valid" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        hasToChangePassword: true,
        subscriptions: true,
      },
    });

    const subscriptions = await Promise.all(
      user?.subscriptions?.map(async (subscription) => {
        const s = await getSubscription(subscription.id);
        return s;
      }) || []
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, subscriptions });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

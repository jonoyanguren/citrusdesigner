import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { DeliverableType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const decodedToken = await verifyToken();

    if (!decodedToken) {
      return NextResponse.json(
        { error: "No token provided or not valid" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { preferDeliverable } = body;

    // Check if the preferred delivery is a valid enum value
    if (
      preferDeliverable !== null &&
      !Object.values(DeliverableType).includes(preferDeliverable)
    ) {
      return NextResponse.json(
        { error: "Invalid delivery method" },
        { status: 400 }
      );
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: decodedToken.userId },
      data: {
        preferDeliverable: preferDeliverable,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        preferDeliverable: true,
      },
    });

    return NextResponse.json({
      message: "Preferences updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

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
        preferDeliverable: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ preferences: user });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

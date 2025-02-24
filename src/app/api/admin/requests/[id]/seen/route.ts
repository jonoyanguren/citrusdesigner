import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/users";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userIsAdmin = await isAdmin();

    if (!userIsAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const requestId = params.id;

    const updatedRequest = await prisma.request.update({
      where: {
        id: requestId,
      },
      data: {
        seenByAdmin: true,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

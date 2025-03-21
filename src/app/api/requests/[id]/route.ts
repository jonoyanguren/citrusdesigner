import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;

  if (!resolvedParams?.id) {
    return NextResponse.json(
      { error: "Request ID is required" },
      { status: 400 }
    );
  }

  const id = resolvedParams.id;

  try {
    const requestData = await prisma.request.findUnique({
      where: { id },
      include: {
        feedback: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    if (!requestData) {
      return NextResponse.json(
        { error: `Request with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(requestData);
  } catch (error) {
    console.error("Error fetching request:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error fetching request: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the request" },
      { status: 500 }
    );
  }
}

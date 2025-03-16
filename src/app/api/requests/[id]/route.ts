import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params?.id) {
    return NextResponse.json(
      { error: "Request ID is required" },
      { status: 400 }
    );
  }

  const resolvedParams = await Promise.resolve(params);
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
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(requestData);
  } catch (error: any) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Error fetching request" },
      { status: 500 }
    );
  }
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, timeToComplete } = await request.json();
    console.log("¡¡¡¡¡¡¡¡¡¡¡ TIME TO COMPLETE", timeToComplete);
    const updatedRequest = await prisma.request.update({
      where: { id: params.id },
      data: { status, timeToComplete },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating request status" },
      { status: 500 }
    );
  }
}

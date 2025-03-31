import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.configuration.findUnique({
      where: { key: "MAX_PROJECTS" },
    });

    if (!config) {
      return NextResponse.json({ value: "3" }); // Default value if not found
    }

    return NextResponse.json({ value: config.value });
  } catch (error) {
    console.error("Error fetching max projects configuration:", error);
    return NextResponse.json({ value: "3" }); // Default value if there's an error
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Language } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale");

    const posts = await prisma.blogPost.findMany({
      where: {
        language: (locale?.toUpperCase() as Language) || Language.ES,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

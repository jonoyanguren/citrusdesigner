import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifyToken();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      slug,
      content,
      excerpt,
      metaTitle,
      metaDesc,
      keywords,
      publishedAt,
      language,
    } = await request.json();

    const { id } = await context.params;

    // Check if new slug is already taken by another post
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost && existingPost.id !== id) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        metaTitle,
        metaDesc,
        keywords,
        publishedAt,
        language,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

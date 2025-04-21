import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
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
    } = await request.json();

    const { id } = params;

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

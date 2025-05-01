import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await verifyToken();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        createdAt: true,
        publishedAt: true,
        userId: true,
        language: true,
        translatedSlug: true,
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

export async function POST(request: Request) {
  try {
    const session = await verifyToken();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin") {
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
      language,
    } = await request.json();

    if (
      !title ||
      !slug ||
      !content ||
      !excerpt ||
      !metaTitle ||
      !metaDesc ||
      !keywords ||
      !language
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length > 1000000) {
      return NextResponse.json({ error: "Content too large" }, { status: 400 });
    }

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        metaTitle,
        metaDesc,
        keywords,
        language,
        userId: session.userId,
        publishedAt: null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

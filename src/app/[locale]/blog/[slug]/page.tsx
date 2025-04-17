import { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/BlogPostContent";

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
    locale: "es",
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
    select: {
      title: true,
      metaTitle: true,
      metaDesc: true,
      keywords: true,
    },
  });

  if (!post) {
    return {
      title: "Post no encontrado",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc,
    keywords: post.keywords || [],
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || "",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDesc || "",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return <BlogPostContent post={post ?? null} />;
}

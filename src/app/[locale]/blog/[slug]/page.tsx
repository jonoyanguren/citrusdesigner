import prisma from "@/lib/prisma";
import BlogPostContent from "@/components/BlogPostContent";

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
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
    keywords: post.keywords,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) {
    return <BlogPostContent post={null} />;
  }

  return <BlogPostContent post={post} />;
}

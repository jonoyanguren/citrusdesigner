"use client";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  published: boolean;
  createdAt: string;
  publishedAt: string;
  language: string;
}

export default function EditBlogPostPage() {
  const t = useTranslations("blog");
  const params = useParams();
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/admin/${params.slug}`);

        if (!response.ok) {
          throw new Error("Post not found");
        }

        const data = await response.json();
        console.log("data", data);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return <div className="container mx-auto py-8">{t("admin.loading")}</div>;
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">{t("admin.postNotFound")}</div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">{t("admin.editPost")}</h1>
      <BlogPostForm
        initialData={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          metaTitle: post.metaTitle,
          metaDesc: post.metaDesc,
          keywords: post.keywords,
          publishedAt: post.publishedAt,
          language: post.language as "ES" | "EN",
        }}
        postId={post.id}
      />
    </div>
  );
}

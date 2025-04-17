"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

function extractFirstImage(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

export default function BlogPage() {
  const t = useTranslations("blog");
  const { locale } = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold mb-12 text-center">{t("title")}</h1>

      <div className="grid gap-12">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${locale}/blog/${post.slug}`}
            className="group"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>
                    {format(new Date(post.createdAt), "PPP", { locale: es })}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{post.user.name}</span>
                </div>
              </div>
              <div className="md:w-1/3 relative aspect-video">
                {extractFirstImage(post.content) ? (
                  <Image
                    src={extractFirstImage(post.content) || ""}
                    alt={post.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg" />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

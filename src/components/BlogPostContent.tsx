"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    name: string;
  };
}

interface Props {
  post: BlogPost | null;
}

export default function BlogPostContent({ post }: Props) {
  const t = useTranslations("blog");

  if (!post) {
    return <div className="container mx-auto py-8">{t("notFound")}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-500 mb-8">
          {format(new Date(post.createdAt), "PPP", { locale: es })} •{" "}
          {post.user.name}
        </div>
        <div className="prose prose-lg max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-2">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
}

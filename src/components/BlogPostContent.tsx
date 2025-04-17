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
    <div className="container mx-auto py-8 pb-24">
      <article className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 leading-tight">{post.title}</h1>
        <div className="text-gray-500 mb-8 text-lg">
          {format(new Date(post.createdAt), "PPP", { locale: es })} •{" "}
          {post.user.name}
        </div>
        <div
          className="prose prose-lg max-w-none 
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-8 [&_h1]:leading-tight [&_h1]:text-gray-900
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-6 [&_h2]:leading-tight [&_h2]:text-gray-900
          [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:leading-tight [&_h3]:text-gray-900
          [&_p]:text-lg [&_p]:mb-6 [&_p]:leading-relaxed [&_p]:text-justify [&_p]:text-gray-700
          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol]:space-y-1
          [&_li]:text-lg [&_li]:mb-0 [&_li]:text-gray-800
          [&_strong]:text-gray-900
          [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:mb-6
          [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:mb-6
          [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded
          [&_img]:mx-auto [&_img]:block [&_img]:mb-2
          [&_figcaption]:text-sm [&_figcaption]:italic [&_figcaption]:text-gray-600 [&_figcaption]:text-center [&_figcaption]:mb-6"
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
}

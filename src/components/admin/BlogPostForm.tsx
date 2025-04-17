"use client";
import React, { useState, useRef, useEffect } from "react";
import { RichText } from "@/components/RichText";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";

interface RichTextHandle {
  getValue: () => string;
  clearContent: () => void;
  setContent: (content: string) => void;
}

interface BlogPostFormProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    metaTitle: string;
    metaDesc: string;
    keywords: string;
    publishedAt?: Date | null;
  };
  postId?: string;
}

export default function BlogPostForm({
  initialData,
  postId,
}: BlogPostFormProps) {
  const t = useTranslations("blog.form");
  const router = useRouter();
  const { locale } = useParams();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDesc, setMetaDesc] = useState(initialData?.metaDesc || "");
  const [keywords, setKeywords] = useState(initialData?.keywords || "");
  const [publishedAt, setPublishedAt] = useState<Date | null>(
    initialData?.publishedAt || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const richTextRef = useRef<RichTextHandle>(null);
  const [initialContent, setInitialContent] = useState(
    initialData?.content || ""
  );

  useEffect(() => {
    if (initialData?.content) {
      setInitialContent(initialData.content);
    }
  }, [initialData?.content]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!richTextRef.current || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    const content = richTextRef.current.getValue();

    try {
      const token = localStorage.getItem("token");
      const url = postId ? `/api/blog/admin/${postId}` : "/api/blog";
      const method = postId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: postId,
          title,
          slug,
          content,
          excerpt,
          metaTitle,
          metaDesc,
          keywords,
          publishedAt,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save post");
      }

      router.push(`/${locale}/admin/blog`);
    } catch (error) {
      console.error("Error saving post:", error);
      setError(error instanceof Error ? error.message : "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="title">{t("title")}</label>
        <Input id="title" value={title} onChange={handleTitleChange} required />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug">{t("slug")}</label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt">{t("excerpt")}</label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label>{t("content")}</label>
        <RichText ref={richTextRef} value={initialContent} />
      </div>

      <div className="space-y-2">
        <label htmlFor="publishedAt">{t("publishDate")}</label>
        <Input
          id="publishedAt"
          type="datetime-local"
          value={publishedAt ? publishedAt.toISOString().slice(0, 16) : ""}
          onChange={(e) =>
            setPublishedAt(e.target.value ? new Date(e.target.value) : null)
          }
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="metaTitle">{t("metaTitle")}</label>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="metaDesc">{t("metaDesc")}</label>
        <Textarea
          id="metaDesc"
          value={metaDesc}
          onChange={(e) => setMetaDesc(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="keywords">{t("keywords")}</label>
        <Input
          id="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

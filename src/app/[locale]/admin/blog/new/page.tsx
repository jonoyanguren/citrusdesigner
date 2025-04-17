"use client";
import React from "react";
import { useTranslations } from "next-intl";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  const t = useTranslations("blog");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">{t("admin.newPost")}</h1>
      <BlogPostForm />
    </div>
  );
}

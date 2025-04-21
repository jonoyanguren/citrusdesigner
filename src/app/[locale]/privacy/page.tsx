"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";

export default function PrivacyPage() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useParams();
  const t = useTranslations("privacy");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/policies/privacy-${locale}.md`);
        if (!response.ok) {
          throw new Error("Failed to load privacy policy");
        }
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Error loading privacy policy:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">{t("title")}</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <article className="prose prose-lg dark:prose-invert mx-auto max-w-4xl">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mb-8">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-semibold mt-12 mb-6">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-relaxed mb-6">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-lg leading-relaxed">{children}</li>
              ),
              em: ({ children }) => (
                <em className="text-gray-600 dark:text-gray-400">{children}</em>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-primary hover:text-primary/80 underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

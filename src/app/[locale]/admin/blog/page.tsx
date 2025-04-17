"use client";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { format, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { format as formatDate } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  publishedAt: string | null;
}

export default function AdminBlogPage() {
  const t = useTranslations("blog");
  const { locale } = useParams();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog/admin");
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

  const handlePublish = async (post: BlogPost, date: Date | null) => {
    console.log("handlePublish called with:", { post, date });
    try {
      const response = await fetch(`/api/blog/admin/${post.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ publishedAt: date }),
      });

      if (!response.ok) {
        throw new Error(t("admin.error.updating"));
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id ? { ...p, publishedAt: updatedPost.publishedAt } : p
        )
      );
      setSelectedDate(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const getPostStatus = (publishedAt: string | null) => {
    if (!publishedAt) return t("admin.status.draft");
    const publishDate = new Date(publishedAt);
    const now = new Date();
    if (isBefore(now, publishDate)) return t("admin.status.scheduled");
    return t("admin.status.published");
  };

  if (loading) {
    return <div className="container mx-auto py-8">{t("admin.loading")}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t("admin.title")}</h1>
        <Button variant="primary" href={`/${locale}/admin/blog/new`}>
          {t("admin.createPost")}
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="text-sm text-gray-500">
                  {format(new Date(post.createdAt), "PPP", { locale: es })}
                </div>
                <div
                  className={`text-sm mt-1 fl ${
                    !post.publishedAt
                      ? "text-gray-600"
                      : isAfter(new Date(post.publishedAt), new Date())
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {!post.publishedAt
                    ? t("admin.status.draft")
                    : isAfter(new Date(post.publishedAt), new Date())
                    ? t("admin.status.scheduled")
                    : t("admin.status.published")}
                  {post.publishedAt && (
                    <>
                      :{" "}
                      {format(new Date(post.publishedAt), "PPP", {
                        locale: es,
                      })}
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <Link
                  href={`/${locale}/admin/blog/${post.slug}`}
                  className="text-primary hover:text-primary/80 mr-4"
                >
                  {t("admin.edit")}
                </Link>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="outline"
                      className={`px-3 py-1 rounded flex items-center gap-2 ${
                        post.publishedAt
                          ? isAfter(new Date(post.publishedAt), new Date())
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                      onClick={() => {
                        setSelectedDate(
                          post.publishedAt ? new Date(post.publishedAt) : null
                        );
                      }}
                    >
                      <FaCalendarAlt className="w-4 h-4" />
                      {getPostStatus(post.publishedAt)}
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[220px] bg-white rounded-md shadow-lg p-4"
                      sideOffset={5}
                    >
                      <div className="mb-4">
                        <input
                          type="datetime-local"
                          value={
                            selectedDate
                              ? formatDate(selectedDate, "yyyy-MM-dd'T'HH:mm")
                              : ""
                          }
                          onChange={(e) =>
                            setSelectedDate(
                              e.target.value ? new Date(e.target.value) : null
                            )
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <DropdownMenu.Item asChild>
                          <Button variant="outline">{t("admin.cancel")}</Button>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                          <Button
                            onClick={() => {
                              handlePublish(post, selectedDate);
                            }}
                          >
                            {t("admin.save")}
                          </Button>
                        </DropdownMenu.Item>
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

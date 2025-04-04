"use client";
import { useEffect, useState } from "react";
import { User, ManualSubscription } from "@prisma/client";
import { ManualSubscriptions } from "@/components/admin/ManualSubscriptions";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserWithManualSubscription extends User {
  manualSubscriptions: ManualSubscription[];
}

export default function ManualSubscriptionsPage() {
  const [users, setUsers] = useState<UserWithManualSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("admin");
  const router = useRouter();
  const { locale } = useParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "admin") {
      router.replace(`/${locale}/dashboard`);
      return;
    }
  }, [user, loading, router, locale]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== "admin") return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/users/manual-subscriptions");

        if (!response.ok) {
          throw new Error("Failed to fetch manual subscription users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users with manual subscriptions:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user?.role === "admin") {
      fetchUsers();
    }
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-2">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-lg">{t("error", { error })}</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {t("menu.manualSubscriptions") || "Manual Subscriptions"}
        </h1>
        <ManualSubscriptions users={users} />
      </div>
    </div>
  );
}

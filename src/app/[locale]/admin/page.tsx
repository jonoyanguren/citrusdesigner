"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UsersList } from "@/components/admin/UsersList";
import { AdminRequests } from "@/components/admin/AdminRequests";
import { Configuration } from "@/components/admin/Configuration";
import { useTranslations } from "next-intl";
import { ManualSubscriptions } from "@/components/admin/ManualSubscriptions";

const MENU_ITEMS = [
  { nameKey: "admin.menu.users", id: "users" },
  { nameKey: "admin.menu.requests", id: "requests" },
  { nameKey: "admin.menu.manualSubscriptions", id: "manual-subscriptions" },
  { nameKey: "admin.menu.settings", id: "settings" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { locale } = useParams();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [manualSubscriptionsUsers, setManualSubscriptionsUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const t = useTranslations();

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "admin") {
      router.replace(`/${locale}/dashboard`);
      return;
    }
  }, [user, loading, router, locale]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUsers = async () => {
          const response = await fetch("/api/admin/users");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUsers(data);
        };

        const fetchRequests = async () => {
          const response = await fetch("/api/admin/requests");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setRequests(data);
        };

        const fetchManualSubscriptionsUsers = async () => {
          const response = await fetch("/api/admin/users/manual-subscriptions");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setManualSubscriptionsUsers(data);
        };
        await Promise.all([
          fetchUsers(),
          fetchRequests(),
          fetchManualSubscriptionsUsers(),
        ]);
      } catch (error) {
        console.error("Error detallado al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading && user?.role === "admin") {
      fetchData();
    }
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
        <span className="ml-2">{t("admin.loading")}</span>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersList users={users} />;
      case "requests":
        return <AdminRequests requests={requests} />;
      case "settings":
        return <Configuration />;
      case "manual-subscriptions":
        return <ManualSubscriptions users={manualSubscriptionsUsers} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8 pt-20">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
            <p className="text-foreground/60">
              {t("admin.welcome")}, {user?.name}
            </p>
          </div>

          <nav className="border-b border-gray-200">
            <div className="flex space-x-8">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`pb-4 px-1 border-b-2 text-sm font-medium ${
                    activeTab === item.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {t(item.nameKey)}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div>{renderContent()}</div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Subscription, Request } from "@prisma/client";
import { SubscriptionsTab } from "@/components/dashboard/SubscriptionsTab";
import { RequestsTab } from "@/components/dashboard/RequestsTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";

interface UserWithSubscriptions extends User {
  subscriptions: (Subscription & {
    stripeSubscription?: {
      status: string;
      current_period_end: string;
      current_period_start: string;
    };
  })[];
}

interface RequestWithFeedback extends Request {
  feedback: {
    id: string;
    feedback: string;
    createdAt: Date;
    user: {
      name: string;
    };
  }[];
}

const MENU_ITEMS = [
  { name: "Mis suscripciones", id: "subscriptions" },
  { name: "Mis peticiones", id: "requests" },
  { name: "Mi perfil", id: "profile" },
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "subscriptions";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState<UserWithSubscriptions | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [requests, setRequests] = useState<RequestWithFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetch("/api/profile");
        if (!userResponse.ok) {
          throw new Error("No autorizado");
        }
        const profile = await userResponse.json();
        setUser(profile.user);
        setSubscriptions(profile.subscriptions);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (activeTab === "requests") {
      const fetchRequests = async () => {
        try {
          const response = await fetch("/api/requests");
          if (response.ok) {
            const data = await response.json();
            setRequests(data);
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };

      fetchRequests();
    }
  }, [activeTab]);

  if (user?.hasToChangePassword) {
    router.push("/dashboard/change-password-first-time");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "subscriptions":
        return <SubscriptionsTab subscriptions={subscriptions} />;
      case "requests":
        return <RequestsTab requests={requests} isAdmin={false} />;
      case "profile":
        return <ProfileTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8 pt-20">
        {/* Header with Navigation */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-foreground/60">Bienvenido, {user?.name}</p>
          </div>

          {/* Navigation Menu */}
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
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}

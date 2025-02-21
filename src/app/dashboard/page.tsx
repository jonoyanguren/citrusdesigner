"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Subscription } from "@prisma/client";
import { SubscriptionCard } from "@/components/SubscriptionCard";

interface UserWithSubscriptions extends User {
  subscriptions: (Subscription & {
    stripeSubscription?: {
      status: string;
      current_period_end: string;
      current_period_start: string;
    };
  })[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserWithSubscriptions | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
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
        console.log("profile", profile);
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8 pt-20">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-foreground/60">Bienvenido, {user?.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { User, Subscription, ManualSubscription } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { RequestsTab } from "@/components/dashboard/RequestsTab";
import { RequestWithFeedback } from "@/types/requests";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

interface UserWithRequestsAndSubscriptions extends User {
  requests: RequestWithFeedback[];
  subscriptions: Subscription[];
  manualSubscriptions: ManualSubscription[];
}

interface PlanInfo {
  [key: string]: {
    planName: string;
    price?: number;
    formattedPrice?: string;
  };
}

export default function CustomerDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<UserWithRequestsAndSubscriptions | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [planInfo, setPlanInfo] = useState<PlanInfo>({});
  const t = useTranslations("customerDetails");
  const { locale } = useParams();

  const fetchUser = useCallback(async () => {
    const response = await fetch(`/api/admin/users/${id}`);
    const data = await response.json();
    console.log("DATA", data);
    setUser(data);

    // Una vez tenemos las suscripciones, obtenemos los nombres de los planes
    if (data?.subscriptions?.length > 0) {
      await Promise.all(
        data.subscriptions.map(async (subscription: Subscription) => {
          // Solo consultamos para suscripciones de Stripe (no manuales)
          if (subscription.stripeUserId !== "manual") {
            await fetchPlanInfo(subscription.id);
          }
        })
      );
    }
  }, [id]);

  // Obtener el nombre del plan y precio desde la API
  const fetchPlanInfo = async (subscriptionId: string) => {
    try {
      const response = await fetch(
        `/api/admin/subscriptions/info?stripeId=${subscriptionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch plan info");
      }

      const data = await response.json();

      setPlanInfo((prev) => ({
        ...prev,
        [subscriptionId]: {
          planName: data.planName || "Unknown Plan",
          price: data.price,
          formattedPrice: data.formattedPrice,
        },
      }));
    } catch (error) {
      console.error("Error fetching plan info:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  console.log("USER", user);
  const handleCancelSubscription = async (
    subscriptionId: string,
    isManual: boolean = false
  ) => {
    if (
      !confirm(
        t("subscriptions.cancelConfirm") ||
          "Are you sure you want to cancel this subscription?"
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isManual
        ? `/api/admin/manual-subscriptions/${subscriptionId}/cancel`
        : `/api/admin/subscriptions/${subscriptionId}/cancel`;

      const response = await fetch(endpoint, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel subscription");
      }

      await fetchUser(); // Refresh user data
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert(
        error instanceof Error ? error.message : "Failed to cancel subscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8 pt-20 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Link
          href={`/${locale}/admin/create-request`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          {t("createRequest")}
        </Link>
      </div>
      <div className="max-w-7xl mx-auto space-y-8 pt-8">
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              {t("customerInfo.title")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">{t("customerInfo.name")}</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-500">{t("customerInfo.email")}</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">{t("customerInfo.role")}</p>
                <p className="font-medium">{user?.role}</p>
              </div>
              <div>
                <p className="text-gray-500">
                  {t("customerInfo.registrationDate")}
                </p>
                <p className="font-medium">
                  {user?.createdAt &&
                    new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stripe Subscriptions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              {t("subscriptions.title") || "Subscriptions"}
            </h2>
            {user?.subscriptions && user.subscriptions.length > 0 ? (
              <div className="overflow-x-auto mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  {t("subscriptions.stripe") || "Stripe Subscriptions"}
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.status") || "Status"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.plan") || "Plan"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.price") || "Price"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.created") || "Created At"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.subscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              subscription.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {subscription.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {planInfo[subscription.id]?.planName ||
                            (subscription.stripeUserId === "manual"
                              ? "Manual Subscription"
                              : subscription.productId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {planInfo[subscription.id]?.formattedPrice || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(
                            subscription.createdAt
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subscription.status === "active" && (
                            <Button
                              variant="secondary"
                              disabled={isLoading}
                              onClick={() =>
                                handleCancelSubscription(subscription.id)
                              }
                              className="text-sm py-1 px-2"
                            >
                              {t("subscriptions.cancel") || "Cancel"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  {t("subscriptions.stripe") || "Stripe Subscriptions"}
                </h3>
                <p className="text-gray-500">
                  {t("subscriptions.none") || "No subscriptions found"}
                </p>
              </div>
            )}

            {/* Manual Subscriptions */}
            {user?.manualSubscriptions &&
            user.manualSubscriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold mb-2">
                  {t("subscriptions.manual") || "Manual Subscriptions"}
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.status") || "Status"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.price") || "Price"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.created") || "Created At"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {t("subscriptions.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.manualSubscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              subscription.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {subscription.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatPrice(subscription.price || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(
                            subscription.createdAt
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subscription.status === "active" && (
                            <Button
                              variant="secondary"
                              disabled={isLoading}
                              onClick={() =>
                                handleCancelSubscription(subscription.id, true)
                              }
                              className="text-sm py-1 px-2"
                            >
                              {t("subscriptions.cancel") || "Cancel"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("subscriptions.manual") || "Manual Subscriptions"}
                </h3>
                <p className="text-gray-500">
                  {t("subscriptions.none") || "No subscriptions found"}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">
              {t("latestRequests.title")}
            </h2>
            {user?.requests && (
              <RequestsTab requests={user.requests} isAdmin={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

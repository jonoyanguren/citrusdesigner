import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import Button from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useParams } from "next/navigation";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ManualSubscription } from "@prisma/client";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        unit_amount: number;
        currency: string;
        product: {
          name: string;
          description: string;
        };
      };
    }>;
  };
  canceled_at: number | null;
  cancel_at_period_end: boolean;
}

interface SubscriptionsTabProps {
  subscriptions: StripeSubscription[];
  manualSubscriptions: ManualSubscription[];
  isLoading: boolean;
}

export function SubscriptionsTab({
  subscriptions,
  manualSubscriptions,
  isLoading,
}: SubscriptionsTabProps) {
  const t = useTranslations("dashboard.subscriptions");
  const params = useParams();
  const [maxProjects, setMaxProjects] = useState(3);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<StripeSubscription | null>(null);
  const [isReactivating, setIsReactivating] = useState(false);

  const hasActiveSubscription = subscriptions.some(
    (sub) => sub.status === "active" && !sub.cancel_at_period_end
  );

  const totalActiveSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active" && !sub.cancel_at_period_end
  ).length;

  const fetchMaxProjects = async () => {
    try {
      const response = await fetch("/api/configurations/max-projects");

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to fetch max projects");
      }

      const data = await response.json();
      return parseInt(data.value, 10);
    } catch (error) {
      console.error("Error fetching max projects:", error);
      return 3; // Default value if there's an error
    }
  };

  const handleCancelClick = (subscriptionId: string) => {
    setSelectedSubscription(
      subscriptions.find((sub) => sub.id === subscriptionId) || null
    );
    setShowConfirmModal(true);
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al cancelar la suscripción");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Ha ocurrido un error al cancelar la suscripción");
    }
  };

  const handleReactivateClick = (subscriptionId: string) => {
    setSelectedSubscription(
      subscriptions.find((sub) => sub.id === subscriptionId) || null
    );
    setIsReactivating(true);
  };

  const handleReactivateSubscription = async () => {
    if (!selectedSubscription) return;

    setIsReactivating(true);
    try {
      const response = await fetch("/api/subscription/reactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: selectedSubscription.id,
          locale: params.locale,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al reactivar la suscripción");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe not loaded");

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ha ocurrido un error al reactivar la suscripción");
    } finally {
      setIsReactivating(false);
      setShowConfirmModal(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "canceled":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "incomplete":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const maxProjectsValue = await fetchMaxProjects();
        setMaxProjects(maxProjectsValue);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!subscriptions?.length && !manualSubscriptions?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          {t("empty.title")}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{t("empty.description")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{t("title")}</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("table.plan")}</TableHeaderCell>
              <TableHeaderCell>{t("table.amount")}</TableHeaderCell>
              <TableHeaderCell>{t("table.startDate")}</TableHeaderCell>
              <TableHeaderCell>{t("table.endDate")}</TableHeaderCell>
              <TableHeaderCell>{t("table.status")}</TableHeaderCell>
              <TableHeaderCell>{t("table.actions")}</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {subscription.items.data[0]?.price.product.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {subscription.items.data[0]?.price.product.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {subscription.items.data[0]?.price
                    ? formatAmount(
                        subscription.items.data[0].price.unit_amount,
                        subscription.items.data[0].price.currency
                      )
                    : "-"}
                </TableCell>
                <TableCell>
                  {subscription.current_period_start
                    ? formatDate(subscription.current_period_start)
                    : "-"}
                </TableCell>
                <TableCell>
                  {subscription.current_period_end
                    ? formatDate(subscription.current_period_end)
                    : "-"}
                </TableCell>
                <TableCell>
                  <span className={getStatusBadgeClass(subscription.status)}>
                    {t(`status.${subscription.status || "unknown"}`)}
                  </span>
                </TableCell>
                <TableCell>
                  {subscription.status === "active" ? (
                    <Button
                      variant="outline"
                      onClick={() => handleCancelClick(subscription.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      {t("actions.cancel")}
                    </Button>
                  ) : subscription.status === "canceled" ? (
                    hasActiveSubscription ? (
                      <span className="text-sm text-gray-500">
                        {t("actions.hasActiveSubscription")}
                      </span>
                    ) : totalActiveSubscriptions >= maxProjects ? (
                      <div className="text-sm">
                        <p className="text-red-600 mb-2">
                          {t("maxSubscriptionsReached")}
                        </p>
                        <Link
                          href={`/${params.locale}/pricing`}
                          className="text-blue-600 hover:underline"
                        >
                          {t("joinWaitlist")}
                        </Link>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleReactivateClick(subscription.id)}
                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        disabled={isReactivating}
                      >
                        {isReactivating
                          ? t("modal.reactivating")
                          : t("actions.reactivate")}
                      </Button>
                    )
                  ) : (
                    <span className="text-sm text-gray-500">
                      {t("actions.noActions")}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {manualSubscriptions.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-8">
              {t("manualSubscriptions.title")}
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>{t("table.plan")}</TableHeaderCell>
                  <TableHeaderCell>{t("table.amount")}</TableHeaderCell>
                  <TableHeaderCell>{t("table.startDate")}</TableHeaderCell>
                  <TableHeaderCell>{t("table.status")}</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manualSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {t("manualSubscriptions.manualName")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t("manualSubscriptions.manualDescription")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatAmount(subscription.price, "EUR")}
                    </TableCell>
                    <TableCell>
                      {new Date(subscription.createdAt).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={getStatusBadgeClass(subscription.status)}
                      >
                        {t(`status.${subscription.status || "unknown"}`)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleCancelSubscription}
        title={t("modal.title")}
        message={t("modal.description")}
        confirmText={t("modal.confirm")}
        cancelText={t("modal.cancel")}
      />

      <ConfirmModal
        isOpen={isReactivating}
        onClose={() => setIsReactivating(false)}
        onConfirm={handleReactivateSubscription}
        title={t("modal.reactivateTitle")}
        message={t("modal.reactivateDescription")}
        confirmText={t("modal.reactivateConfirm")}
        cancelText={t("modal.reactivateCancel")}
      />
    </>
  );
}

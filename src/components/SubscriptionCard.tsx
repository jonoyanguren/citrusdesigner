import { Subscription } from "@prisma/client";
import Button from "@/components/Button";
interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(parseInt(dateString) * 1000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "canceled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar tu suscripción?")) {
      return;
    }

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

      // Recargar la página para mostrar el nuevo estado
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Ha ocurrido un error al cancelar la suscripción");
    }
  };

  return (
    <div className="p-6 rounded-lg border border-border bg-card shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Suscripción</h2>
        <span className={getStatusBadgeClass(subscription.status)}>
          {subscription.status === "active" ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">ID de Suscripción</p>
          <p className="text-sm font-mono">{subscription.id}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Periodo actual</p>
          <p className="text-sm">
            {subscription.current_period_start &&
              subscription.current_period_end && (
                <>
                  {formatDate(subscription.current_period_start)} -{" "}
                  {formatDate(subscription.current_period_end)}
                </>
              )}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Precio mensual</p>
          <p className="text-lg font-semibold">
            {subscription.plan &&
              formatPrice(subscription.plan.amount, subscription.plan.currency)}
          </p>
        </div>
      </div>
      {subscription.status === "active" && (
        <Button
          variant="text"
          onClick={handleCancelSubscription}
          className="w-full pr-0 flex justify-end text-red-500 text-right"
        >
          Cancelar suscripción
        </Button>
      )}
    </div>
  );
}

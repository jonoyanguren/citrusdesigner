import { DeliverableType } from "@prisma/client";
import { useTranslations } from "next-intl";

interface DeliverableSelectProps {
  onSelect: (deliverable: DeliverableType | null) => void;
  selectedDeliverable?: DeliverableType | null;
  label?: string;
  className?: string;
  fromAdmin?: boolean;
}

export function DeliverableSelect({
  onSelect,
  selectedDeliverable = null,
  label = "Método de entrega",
  className = "",
  fromAdmin = false,
}: DeliverableSelectProps) {
  const t = useTranslations("dashboard.createRequest");

  // Get all values from DeliverableType enum
  const deliverableOptions = Object.values(DeliverableType);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </label>
      )}

      {!fromAdmin && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {t("deliverableTypeHelp")}
        </p>
      )}

      <select
        className="w-full px-3 py-2 border rounded-lg"
        value={selectedDeliverable || ""}
        onChange={(e) => {
          const value = e.target.value as DeliverableType | "";
          onSelect(value ? (value as DeliverableType) : null);
        }}
      >
        <option value="">
          {t("selectDeliverable") || "Selecciona un método de entrega"}
        </option>
        {deliverableOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

import { getTranslations } from "next-intl/server";

type Status = "PENDING" | "ACCEPTED" | "WORKING" | "DONE";

interface StatusBadgeProps {
  status: Status;
  showEstimatedTime?: boolean;
  estimatedTime?: string;
}

export async function StatusBadgeServer({
  status,
  showEstimatedTime = false,
  estimatedTime,
}: StatusBadgeProps) {
  const t = await getTranslations("dashboard.requestDetail");

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-green-800";
      case "WORKING":
        return "bg-purple-100 text-purple-800";
      case "DONE":
        return "bg-green-100 text-blue-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span
        className={`px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(
          status
        )}`}
      >
        {t(`statuses.${status}`)}
      </span>
      {showEstimatedTime && status === "WORKING" && estimatedTime && (
        <span className="text-sm text-gray-600">
          {t("estimatedTime")}: {estimatedTime}
        </span>
      )}
    </div>
  );
}

import { User, ManualSubscription } from "@prisma/client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import { EmptyState } from "@/components/EmptyState";

interface UserWithManualSubscription extends User {
  manualSubscriptions: ManualSubscription[];
}

interface Props {
  users: UserWithManualSubscription[];
}

export function ManualSubscriptions({ users }: Props) {
  const { locale } = useParams();
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const t = useTranslations("admin.manualSubscriptions");

  console.log("USERS", users);

  const getRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es,
    });
  };

  // Formato de precio con moneda
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Filtrar usuarios con suscripciones manuales
  const usersWithManualSubs = users.filter(
    (user) => user.manualSubscriptions && user.manualSubscriptions.length > 0
  );

  // Aplicar filtros
  const filteredUsers = usersWithManualSubs.filter(
    (user) =>
      user.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      user.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t("title") || "Manual Subscriptions"}
      </h2>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={t("filters.nameSearch") || "Filter by name..."}
            className="w-full px-4 py-2 border rounded-lg"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder={t("filters.emailSearch") || "Filter by email..."}
            className="w-full px-4 py-2 border rounded-lg"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title={t("empty.title") || "No manual subscriptions"}
          description={
            t("empty.description") ||
            "No users with manual subscriptions were found."
          }
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("table.user") || "User"}</TableHeaderCell>
              <TableHeaderCell>{t("table.email") || "Email"}</TableHeaderCell>
              <TableHeaderCell>{t("table.price") || "Price"}</TableHeaderCell>
              <TableHeaderCell>
                {t("table.date") || "Subscription Date"}
              </TableHeaderCell>
              <TableHeaderCell>{t("table.status") || "Status"}</TableHeaderCell>
              <TableHeaderCell>
                {t("table.actions") || "Actions"}
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) =>
              user.manualSubscriptions.map((subscription) => (
                <TableRow key={`${user.id}-${subscription.id}`}>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {formatPrice(subscription.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {getRelativeTime(subscription.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/${locale}/admin/customer-details/${user.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {t("table.viewDetails") || "View details"}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

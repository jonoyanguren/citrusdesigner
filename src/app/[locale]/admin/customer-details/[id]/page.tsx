"use client";
import { User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RequestsTab } from "@/components/dashboard/RequestsTab";
import { RequestWithFeedback } from "@/types/requests";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface UserWithRequests extends User {
  requests: RequestWithFeedback[];
}

export default function CustomerDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<UserWithRequests | null>(null);
  const t = useTranslations("customerDetails");
  const { locale } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/admin/users/${id}`);
      const data = await response.json();
      setUser(data);
    };

    fetchUser();
  }, [id]);

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

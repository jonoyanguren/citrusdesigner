"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { CiMail } from "react-icons/ci";
import Button from "@/components/Button";

type WaitlistEntry = {
  id: string;
  email: string;
  createdAt: string;
};

export default function WaitlistPage() {
  const t = useTranslations("waitlist.admin");
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const response = await fetch("/api/admin/waitlist");
        if (!response.ok) {
          throw new Error("Error fetching waitlist");
        }
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        console.error("Error:", err);
        setError(t("error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaitlist();
  }, [t]);

  return (
    <div className="p-6 mt-24">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {isLoading ? (
        <div className="text-center">{t("loading")}</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <CiMail className="h-12 w-12" aria-hidden="true" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            {t("empty")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{t("emptyDescription")}</p>
          <div className="mt-6">
            <Button onClick={() => window.location.reload()}>
              {t("refresh")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("email")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("registrationDate")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(entry.createdAt), "PPpp", {
                      locale: es,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(entry.email);
                        alert(t("emailCopied"));
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {t("copyEmail")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

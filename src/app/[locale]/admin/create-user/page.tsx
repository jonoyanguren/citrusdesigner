"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import { VALID_LOCALES, LocaleType } from "@/types/locale";

export default function CreateUserPage() {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations("admin.createUser");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    createSubscription: false,
    isAdmin: false,
    password: "",
    locale: (locale as LocaleType) || "en",
    subscriptionPrice: "1000",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create user");
      }

      router.push(`/${locale}/admin`);
    } catch (error) {
      console.error("Error creating user:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      <h1 className="text-2xl font-bold mb-6">
        {t("title") || "Create New User"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t("nameLabel") || "Name"}
          placeholder={t("namePlaceholder") || "Enter user name"}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label={t("emailLabel") || "Email"}
          type="email"
          placeholder={t("emailPlaceholder") || "Enter user email"}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("localeLabel") || "Email Language"}
          </label>
          <select
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            value={formData.locale}
            onChange={(e) =>
              setFormData({ ...formData, locale: e.target.value as LocaleType })
            }
            required
          >
            {VALID_LOCALES.map((localeOption) => (
              <option key={localeOption} value={localeOption}>
                {localeOption === "en"
                  ? "English"
                  : localeOption === "es"
                  ? "Español"
                  : localeOption}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500">
            {t("localeHelp") || "The language for the user's emails"}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="admin"
              checked={formData.isAdmin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isAdmin: e.target.checked,
                  createSubscription: e.target.checked
                    ? false
                    : formData.createSubscription,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="admin" className="cursor-pointer">
              {t("createAdmin") || "Create as admin"}
            </label>
          </div>

          {formData.isAdmin && (
            <div className="pl-6 pt-2">
              <Input
                label={t("passwordLabel") || "Admin Password"}
                type="password"
                placeholder={t("passwordPlaceholder") || "Enter admin password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required={formData.isAdmin}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="subscription"
              checked={formData.createSubscription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  createSubscription: e.target.checked,
                  isAdmin: e.target.checked ? false : formData.isAdmin,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={formData.isAdmin}
            />
            <label htmlFor="subscription" className="cursor-pointer">
              {t("createSubscription") || "Create manual subscription"}
            </label>
          </div>

          {formData.createSubscription && (
            <div className="pl-6 pt-2">
              <Input
                label={t("subscriptionPriceLabel") || "Subscription Price (€)"}
                type="number"
                step="0.01"
                min="0"
                placeholder={
                  t("subscriptionPricePlaceholder") ||
                  "Enter price (e.g. 49.99)"
                }
                value={formData.subscriptionPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscriptionPrice: e.target.value,
                  })
                }
                required={formData.createSubscription}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            {t("buttons.cancel") || "Cancel"}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("buttons.creating") || "Creating..."}
              </span>
            ) : (
              t("buttons.create") || "Create User"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/Input";
import { RichText } from "@/components/RichText";
import Button from "@/components/Button";
import { processContentWithImages } from "@/lib/utils/imageProcessing";
import { useTranslations } from "next-intl";

export default function NuevaPeticionPage() {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations("dashboard.requests.create");
  const [formData, setFormData] = useState({
    name: "",
    request: "",
  });
  const [hasActiveSubscription, setHasActiveSubscription] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch("/api/check-subscription");
        const data = await response.json();
        setHasActiveSubscription(data.hasActiveSubscription);
      } catch (error) {
        console.error("Error checking subscription:", error);
        setHasActiveSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const processedRequest = await processContentWithImages(formData.request);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          request: processedRequest,
        }),
      });

      if (response.ok) {
        router.push(`/${locale}/dashboard?tab=requests`);
      }
    } catch (error) {
      console.error("Error al crear la petición:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-24">
        <p className="text-center">{t("loading")}</p>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t("subscription.required")}
          </h2>
          <p className="mb-6">{t("subscription.message")}</p>
          <Button onClick={() => router.push(`/${locale}/pricing`)}>
            {t("subscription.cta")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label={t("name")}
            placeholder={t("namePlaceholder")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {t("requestLabel")}
          </label>
          <RichText
            initialContent=""
            onChange={(content) =>
              setFormData({ ...formData, request: content })
            }
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{t("submit")}</Button>
        </div>
      </form>
    </div>
  );
}

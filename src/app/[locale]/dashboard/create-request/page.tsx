"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/Input";
import { RichText } from "@/components/RichText";
import Button from "@/components/Button";
import { processContentWithImages } from "@/lib/utils/imageProcessing";
import { useTranslations } from "next-intl";
import { DeliverableSelect } from "@/components/admin/DeliverableSelect";
import { DeliverableType } from "@prisma/client";

export default function NuevaPeticionPage() {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations("dashboard.requests.create");
  const [formData, setFormData] = useState({
    name: "",
    request: "",
    deliverableType: null as DeliverableType | null,
  });
  const [hasActiveSubscription, setHasActiveSubscription] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    request?: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check subscription
        const subscriptionResponse = await fetch("/api/check-subscription");
        const subscriptionData = await subscriptionResponse.json();

        setHasActiveSubscription(subscriptionData.hasActiveSubscription);

        // Fetch user preferences
        const preferencesResponse = await fetch("/api/user/preferences");
        const preferencesData = await preferencesResponse.json();

        if (preferencesData.preferences?.preferDeliverable) {
          setFormData((prev) => ({
            ...prev,
            deliverableType: preferencesData.preferences.preferDeliverable,
          }));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setHasActiveSubscription(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      request?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.request.trim()) {
      newErrors.request = "La descripción es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
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
          deliverable: formData.deliverableType,
        }),
      });

      if (response.ok) {
        router.push(`/${locale}/dashboard?tab=requests`);
      }
    } catch (error) {
      console.error("Error al crear la petición:", error);
    } finally {
      setIsSubmitting(false);
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
            error={errors.name}
          />
        </div>

        <DeliverableSelect
          selectedDeliverable={formData.deliverableType}
          onSelect={(deliverable) =>
            setFormData({ ...formData, deliverableType: deliverable })
          }
          label={t("deliverableTypeLabel") || "Método de entrega"}
        />

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
          {errors.request && (
            <p className="text-red-500 text-sm mt-1">{errors.request}</p>
          )}
        </div>

        {(errors.name || errors.request) && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
            Por favor, completa todos los campos requeridos.
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}

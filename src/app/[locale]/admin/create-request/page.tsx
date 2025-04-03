"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { RichText } from "@/components/RichText";
import { processContentWithImages } from "@/lib/utils/imageProcessing";
import { UsersSelect } from "@/components/admin/UsersSelect";
import { DeliverableSelect } from "@/components/admin/DeliverableSelect";
import { useTranslations } from "next-intl";
import { DeliverableType } from "@prisma/client";

export default function NuevaPeticionPage() {
  const router = useRouter();
  const t = useTranslations("dashboard.createRequest");
  const { locale } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    request: "",
    userId: "",
    deliverable: null as DeliverableType | null,
  });

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
          userId: formData.userId,
          deliverable: formData.deliverable,
        }),
      });

      if (response.ok) {
        router.push(`/${locale}/admin`);
      }
    } catch (error) {
      console.error("Error al crear la petición:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-6">
        {t("title")}{" "}
        <span className="text-sm text-white bg-yellow-800 px-2 py-1 rounded-md">
          {t("adminBadge")}
        </span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label={t("nameLabel")}
            placeholder={t("namePlaceholder")}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <UsersSelect
          label={t("userLabel")}
          selectedUserId={formData.userId}
          onSelect={(userId) => setFormData({ ...formData, userId })}
          className="w-full"
        />

        <DeliverableSelect
          label={t("deliverableLabel") || "Método de entrega"}
          selectedDeliverable={formData.deliverable}
          onSelect={(deliverable) => setFormData({ ...formData, deliverable })}
          className="w-full"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {t("descriptionLabel")}
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
            {t("buttons.cancel")}
          </Button>
          <Button type="submit">{t("buttons.create")}</Button>
        </div>
      </form>
    </div>
  );
}

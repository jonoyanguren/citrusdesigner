"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function WaitlistComponentSmall() {
  const t = useTranslations("waitlist");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const { locale } = useParams();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email, locale }),
      });
      if (!response.ok) {
        throw new Error("Error al unirse a la lista de espera");
      }
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-4 mb-8">
        <div className="relative max-w-4xl mx-auto">
          <Title
            title={t("successTitle")}
            description={t("successDescription")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="relative max-w-4xl mx-auto">
        <p className="font-bold text-center text-lg mt-4 text-neutral-500">
          {t("title")}
        </p>
        <p className="text-center text-lg mt-4 text-neutral-500">
          {t("description")}
        </p>
      </div>
      <div className="flex flex-row max-w-xl mx-auto items-center justify-center gap-4 my-4">
        <Input
          type="email"
          value={email}
          placeholder={t("emailPlaceholder")}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="w-full">
          <Button onClick={handleSubmit}>{t("joinWaitlist")}</Button>
        </div>
      </div>
    </div>
  );
}

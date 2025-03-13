"use client";
import { useTranslations } from "next-intl";
import Button from "./Button";

export default function CTASection() {
  const t = useTranslations("cta");

  return (
    <div className="m-20 w-4/5 rounded-2xl bg-yellow-50 p-20 text-left">
      <h2 className="text-4xl font-medium mb-8 max-w-2xl">{t("title")}</h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <Button variant="outline" href="/calendar">
          {t("primaryButton")}
        </Button>
        <Button href="/pricing">{t("secondaryButton")}</Button>
      </div>
    </div>
  );
}

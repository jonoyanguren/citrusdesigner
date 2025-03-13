"use client";
import Title from "@/components/Title";
import PricingList from "@/components/PricingList";
import { useTranslations } from "next-intl";
import SectionTitle from "@/components/SectionTitle";
export default function Pricing() {
  const t = useTranslations("pricing");
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Title title={t("title")} description={t("description")} />
      {/* Products */}
      <SectionTitle
        title={t("products.title")}
        description={t("products.description")}
        descriptionThin={t("products.descriptionThin")}
        secondaryText={t("products.secondaryText")}
      />
      <div className="mb-16">
        <PricingList />
      </div>

      {/* <Faq /> */}
    </div>
  );
}

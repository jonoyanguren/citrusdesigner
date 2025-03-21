"use client";
import Title from "@/components/Title";
import PricingList from "@/components/PricingList";
import { useTranslations } from "next-intl";
import Faq from "@/components/Faq";
import Image from "next/image";
import CustomersCarousel from "@/components/CustomersCarousel";

export default function Pricing() {
  const t = useTranslations("pricing");
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex flex-row items-center">
        <Image
          className="absolute"
          src="/halfOrange.svg"
          alt="halfOrange"
          width={100}
          height={100}
        />
        <Title title={t("title")} description={t("description")} />
      </div>
      {/* Products */}
      <div className="w-[80%] mb-16">
        <PricingList />
      </div>
      <div className="w-full">
        <CustomersCarousel />
      </div>
      <div className="mt-32">
        <Faq />
      </div>
    </div>
  );
}

"use client";
import CustomersCarousel from "@/components/CustomersCarousel";
import { useTranslations } from "next-intl";
import Hero from "@/components/Hero";
import Title from "@/components/Title";
import Steps from "@/components/Steps";
import Benefits from "@/components/Benefits";
import { OrangeMessage } from "@/components/OrangeMessage";
import { Testimonials } from "@/components/Testimonials";
import { AboutTheDesigner } from "@/components/AboutTheDesigner";
import { Pricing } from "@/components/Pricing";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Customers carousel section*/}
      <CustomersCarousel />

      <div className="min-h-screen flex flex-col items-center">
        {/* Steps */}
        <Title
          title={t("howItWorks.title")}
          description={t("howItWorks.description")}
          highlightIndexes={[3]}
        />

        <Steps />

        {/* Benefits */}
        <Benefits />

        <Pricing />

        <AboutTheDesigner />
        <OrangeMessage message={t("orangeMessage")} highlightIndexes={[5, 6]} />

        <Testimonials />
      </div>
    </div>
  );
}

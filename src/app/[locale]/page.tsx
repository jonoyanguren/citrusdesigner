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
import PricingList from "@/components/PricingList";
import Image from "next/image";
import ProjectsSummary from "@/components/ProjectsSummary";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen">
      <Hero />

      <CustomersCarousel />

      <div className="min-h-screen flex flex-col items-center">
        {/* Steps */}
        <div className="px-4">
          <Title
            title={t("howItWorks.title")}
            description={t("howItWorks.description")}
            highlightIndexes={[3]}
          />

          <Steps />
        </div>
        <Benefits />
        <ProjectsSummary />
        <div className="relative flex flex-col md:flex-row items-center mt-12 md:mt-0 mx-4 md:mx-16">
          <Image
            className="absolute -top-8 md:top-20 md:-left-20 md:mb-0"
            src="/halfOrange.svg"
            alt="halfOrange"
            width={100}
            height={100}
          />
          <Title
            title={t("pricing.title")}
            description={t("pricing.description")}
          />
        </div>

        <div className="flex flex-col md:flex-row mx-4 mt-4 md:mt-0 md:mx-16 mb-16">
          <PricingList />
        </div>
        <AboutTheDesigner />
        <OrangeMessage message={t("orangeMessage")} highlightIndexes={[5, 6]} />

        <Testimonials />
      </div>
    </div>
  );
}

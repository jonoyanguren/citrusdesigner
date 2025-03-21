"use client";
import CustomersCarousel from "@/components/CustomersCarousel";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Hero from "@/components/Hero";
import PricingList from "@/components/PricingList";
import Title from "@/components/Title";
import Steps from "@/components/Steps";
import Benefits from "@/components/Benefits";
import { OrangeMessage } from "@/components/OrangeMessage";
import { Testimonials } from "@/components/Testimonials";
export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen">
      <Hero
        namespace="home"
        buttons={[
          { text: "hero.cta", variant: "primary", href: "/pricing" },
          { text: "hero.ctaSecondary", variant: "secondary", href: "/contact" },
        ]}
      />

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

        {/* Pricing section */}
        <div className="flex flex-row items-center mx-16">
          <Image
            className="absolute"
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

        <div className="mx-16 mb-16">
          <PricingList />
        </div>

        <OrangeMessage message={t("orangeMessage")} highlightIndexes={[5, 6]} />

        <Testimonials />
      </div>
    </div>
  );
}

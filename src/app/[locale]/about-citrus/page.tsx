"use client";
import Hero from "@/components/Hero";
import { useTranslations } from "next-intl";
import ProjectsSection from "@/components/ProjectsSection";
import { Link } from "@/i18n/navigation";
import FeatureItem from "@/components/FeatureItem";
import { motion } from "framer-motion";
import CTASection from "@/components/CTASection";

export default function HowItWorks() {
  const t = useTranslations("aboutCitrus");
  const features = t.raw("features.items");
  // Duplicar 4 veces para asegurar un loop continuo
  const duplicatedFeatures = [
    ...features,
    ...features,
    ...features,
    ...features,
  ];

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Hero namespace="aboutCitrus" />
      <div className="bg-green-800 px-4 md:px-[144px] w-full text-white p-16">
        <div className="max-w-xl">
          <p>{t("valueProposition.valueProposition")}</p>
          <h2 className="text-2xl font-bold mb-6">
            {t("valueProposition.title")}
          </h2>
          <p className="text-md">{t("valueProposition.description")}</p>
        </div>
      </div>
      <ProjectsSection />

      <div className="max-w-7xl mx-auto">
        <CTASection />
      </div>

      {/* Features Section */}
      <div className="w-full bg-green-800 py-12 overflow-hidden">
        <div className="relative">
          <motion.div
            className="flex"
            animate={{
              x: [0, -25 * features.length + "%"],
            }}
            transition={{
              x: {
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {duplicatedFeatures.map(
              (feature: { title: string }, index: number) => (
                <FeatureItem key={index} title={feature.title} />
              )
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

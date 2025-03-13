"use client";
import SectionTitle from "@/components/SectionTitle";
import Title from "@/components/Title";
import ProjectsSection from "@/components/ProjectsSection";
import { useTranslations } from "next-intl";
import Image from "next/image";
import CTASection from "@/components/CTASection";

export default function OurStory() {
  const t = useTranslations("ourStory");

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Title title={t("title")} description={t("subtitle")} />

      {/* Our Story */}
      <div className="w-full">
        <SectionTitle
          title={t("title")}
          description={t("description")}
          descriptionThin={t("descriptionThin")}
        />
        <div className="relative max-w-6xl mx-auto px-4 mb-16">
          <div className="absolute left-0 top-20 -translate-x-1/2 rotate-[-6deg] hidden lg:block w-[267px] h-[375px] border-[16px] border-white rounded-lg shadow-xl">
            <Image
              src="/conMayka.jpeg"
              alt="Story image 1"
              width={267}
              height={375}
              className="object-cover rounded-lg"
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="absolute right-0 top-[40%] translate-x-1/2 rotate-[6deg] hidden lg:block w-[267px] h-[375px] border-[16px] border-white rounded-lg shadow-xl">
            <Image
              src="/conMayka.jpeg"
              alt="Story image 2"
              width={267}
              height={375}
              className="object-cover rounded-lg"
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto text-gray-900 text-xl leading-relaxed">
            <p className="mb-4">{t("text.p1")}</p>
            <p className="mb-4">{t("text.p2")}</p>
            <p className="mb-4">{t("text.p3")}</p>
            <p className="mb-4">{t("text.p4")}</p>
            <p className="font-bold text-2xl mb-4">{t("text.pbold")}</p>
            <p className="mb-4">{t("text.pfinal")}</p>
          </div>
        </div>
      </div>

      {/* Value proposition */}
      <div className="w-full mb-16 text-left bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 flex flex-row">
          <div className="w-1/2 mt-16">
            <h3 className="text-xl font-medium mb-8">
              {t("valueProposition.title")}
            </h3>
            <p className="text-4xl mb-8">{t("valueProposition.description")}</p>
            <p className="text-xl">{t("valueProposition.text")}</p>
          </div>
          <div className="w-1/2 h-[459px] flex items-center justify-end">
            <Image
              className="object-cover pt-16"
              src="/conMayka.jpeg"
              alt="Citrus Designer"
              width={515}
              height={459}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>

      <ProjectsSection />

      <div className="max-w-7xl mx-auto">
        <CTASection />
      </div>
    </div>
  );
}

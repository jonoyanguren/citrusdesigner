"use client";
import SectionTitle from "@/components/SectionTitle";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import Image from "next/image";
import CTASection from "@/components/CTASection";

export default function TheDesignerBehind() {
  const t = useTranslations("designerBehind");

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Title title={t("title")} description={t("subtitle")} />

      {/* Designer Profile */}
      <div className="w-full">
        <SectionTitle
          title={t("whoAmI.title")}
          description={t("whoAmI.description")}
          descriptionThin={t("whoAmI.descriptionThin")}
        />
        <div className="max-w-6xl mx-auto px-4 mb-16 flex md:flex-row flex-col gap-4">
          <Image
            src="/conMayka.jpeg"
            alt="Designer profile image 1"
            width={400}
            height={400}
            className="w-1/2 rounded-lg object-cover"
          />
          <div className="w-1/2 flex flex-col gap-4 text-center text-gray-900 leading-relaxed">
            <p className="mb-4">{t("text.p1")}</p>
            <p className="mb-4">{t("text.p2")}</p>
            <p className="mb-4">{t("text.p3")}</p>
            <p className="font-bold text-2xl mb-4">{t("text.pbold")}</p>
          </div>
        </div>
      </div>

      {/* Expertise & Skills */}
      <div className="w-full mb-16 text-left bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-medium mb-8">
                {t("expertise.title")}
              </h3>
              <p className="text-4xl mb-8">{t("expertise.description")}</p>
              <p className="text-xl">{t("expertise.text")}</p>
            </div>
            <div className="space-y-8">
              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h4 className="font-medium mb-2">
                      {t(`skills.skill${index}.title`)}
                    </h4>
                    <p className="text-gray-600">
                      {t(`skills.skill${index}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Philosophy */}
      <div className="w-full mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-[500px] relative">
              <Image
                src="/designer-workspace.jpg"
                alt="Designer workspace"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-8">
                {t("philosophy.title")}
              </h3>
              <p className="text-4xl mb-8">{t("philosophy.description")}</p>
              <p className="text-xl mb-8">{t("philosophy.text")}</p>
              <ul className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-4 text-emerald-600">•</span>
                    <span>{t(`philosophy.points.point${index}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <CTASection />
      </div>
    </div>
  );
}

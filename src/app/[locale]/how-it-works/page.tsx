"use client";
import { useTranslations } from "next-intl";
import Title from "@/components/Title";
import SectionTitle from "@/components/SectionTitle";
import Image from "next/image";
import { Caveat } from "next/font/google";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import CTASection from "@/components/CTASection";

const caveat = Caveat({ subsets: ["latin"] });

interface Step {
  title: string;
  description: string;
}

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps.steps") as Step[];

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Title title={t("title")} description={t("description")} />
      {/* Steps */}
      <SectionTitle
        title={t("steps.title")}
        description={t("steps.description")}
        descriptionThin={t("steps.descriptionThin")}
        secondaryText={t("steps.secondaryText")}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-center relative pb-16 px-4 md:px-0 gap-8 md:gap-0">
        {/* Curved dotted line */}
        <svg
          className="absolute top-6 left-0 w-full h-20 -z-10 hidden md:block"
          viewBox="0 0 1200 100"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C150,20 300,80 450,50 C600,20 750,80 900,50 C1050,20 1150,80 1200,50"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10,10"
            className="text-gray-300"
          />
        </svg>

        {steps.map((step, index) => (
          <div
            key={step.title}
            className="w-full md:w-1/5 flex flex-col items-center gap-6 py-6 px-4"
          >
            <div className="flex items-start gap-3 justify-center relative">
              <p
                className={`${caveat.className} text-5xl md:text-4xl font-bold text-primary -mt-2`}
              >
                {index + 1}
              </p>
              <Image
                src={`/steps/step${index + 1}.svg`}
                alt={step.title}
                width={100}
                height={100}
                className="w-[120px] md:w-[100px] h-auto"
              />
              {index === 2 && (
                <div className="absolute -bottom-2 -right-6">
                  <Image
                    src="/steps/plane.svg"
                    alt={step.title}
                    width={50}
                    height={50}
                  />
                </div>
              )}
              {index === 4 && (
                <div className="absolute -top-6 -right-4">
                  <Image
                    src="/steps/sparks.svg"
                    alt={step.title}
                    width={70}
                    height={70}
                  />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="text-gray-900 text-sm text-center">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Before and after */}
      <SectionTitle
        title={t("beforeAndAfter.title")}
        description={t("beforeAndAfter.description")}
        descriptionThin={t("beforeAndAfter.descriptionThin")}
        secondaryText={t("beforeAndAfter.secondaryText")}
      />

      <div className="max-w-4xl w-full mx-auto px-4 pb-12">
        <div className="rounded-lg overflow-hidden shadow-xl">
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src="https://raw.githubusercontent.com/nerdyman/stuff/main/libs/react-compare-slider/demo-images/lady-2.png"
                alt="Before"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src="https://raw.githubusercontent.com/nerdyman/stuff/main/libs/react-compare-slider/demo-images/lady-1.png"
                alt="After"
              />
            }
            position={50}
            style={{
              height: "500px",
            }}
            className="cursor-col-resize"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto">
        <CTASection />
      </div>
    </div>
  );
}

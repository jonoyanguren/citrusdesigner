"use client";
import { useTranslations } from "next-intl";
import Title from "@/components/Title";
import Image from "next/image";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import CustomersCarousel from "@/components/CustomersCarousel";
import { Spacer } from "@/components/Spacer";
import { LimeMessage } from "@/components/LimeMessage";
import { OrangeMessage } from "@/components/OrangeMessage";
import Benefits from "@/components/Benefits";
import { OurProjects } from "@/components/OurProjects";
import { Features } from "@/components/Features";
import Steps from "@/components/Steps";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="px-4">
        <Title
          title={t("title")}
          description={t("description")}
          highlightIndexes={[3]}
        />

        <Steps />
      </div>

      <Spacer space={16} />

      <div className="w-full">
        <CustomersCarousel />
      </div>

      {/* Lime Message */}
      <LimeMessage message={t("limeMessage")} highlightIndexes={[13]} />

      {/* Benefits */}
      <Benefits />

      {/* Before and after */}
      <Title title={t("beforeAndAfter.title")} highlightIndexes={[4]} />
      <div className="relative">
        <Image
          className="hidden md:block absolute -top-8 -left-6"
          src="/halfOrange.svg"
          alt="Before and after"
          width={100}
          height={100}
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
      </div>

      <Spacer space={16} />

      <OrangeMessage message={t("orangeMessage")} highlightIndexes={[5, 6]} />

      <OurProjects />

      <Features />
    </div>
  );
}

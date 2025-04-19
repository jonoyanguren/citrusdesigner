"use client";

import CustomersCarousel from "@/components/CustomersCarousel";
import { Spacer } from "@/components/Spacer";
import Steps from "@/components/Steps";
import Title from "@/components/Title";
import { LimeMessage } from "@/components/LimeMessage";
import Benefits from "@/components/Benefits";
import { OrangeMessage } from "@/components/OrangeMessage";
import { OurProjects } from "@/components/OurProjects";
import { Features } from "@/components/Features";
import Image from "next/image";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type Props = {
  translations: {
    title: string;
    description: string;
    limeMessage: string;
    beforeAndAfterTitle: string;
    before: string;
    after: string;
    orangeMessage: string;
  };
};

export function HowItWorksClient({ translations }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="px-4">
        <Title
          title={translations.title}
          description={translations.description}
          highlightIndexes={[3]}
        />
        <Steps />
      </div>

      <Spacer space={16} />

      <div className="w-full">
        <CustomersCarousel />
      </div>

      <LimeMessage message={translations.limeMessage} highlightIndexes={[13]} />

      <Benefits />

      <Title title={translations.beforeAndAfterTitle} highlightIndexes={[4]} />
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
                <ReactCompareSliderImage src="/before.png" alt="Before" />
              }
              itemTwo={<ReactCompareSliderImage src="/after.png" alt="After" />}
              position={50}
              style={{ height: "500px" }}
              className="cursor-col-resize"
            />
          </div>
          <div className="flex justify-between mt-8">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900">{translations.before}</p>
              <FaArrowRight className="text-gray-900" />
            </div>
            <div className="flex items-center gap-2">
              <FaArrowLeft className="text-gray-900" />
              <p className="font-bold text-gray-900">{translations.after}</p>
            </div>
          </div>
        </div>
      </div>

      <Spacer space={16} />

      <OrangeMessage
        message={translations.orangeMessage}
        highlightIndexes={[5, 6]}
      />

      <div id="projects">
        <OurProjects />
      </div>

      <Features />
    </div>
  );
}

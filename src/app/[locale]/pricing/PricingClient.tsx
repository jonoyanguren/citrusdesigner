"use client";

import { AvailablePlaces } from "@/components/AvailablePlaces";
import CustomersCarousel from "@/components/CustomersCarousel";
import Faq from "@/components/Faq";
import PricingList from "@/components/PricingList";
import Title from "@/components/Title";
import Image from "next/image";

type Props = {
  translations: {
    title: string;
    description: string;
  };
};

export function PricingClient({ translations }: Props) {
  return (
    <>
      <div className="relative flex flex-col md:flex-row items-center mt-12 md:mt-0 mx-4 md:mx-16">
        <Image
          className="absolute -top-8 md:top-20 md:left-20 md:mb-0"
          src="/halfOrange.svg"
          alt="halfOrange"
          width={100}
          height={100}
        />
        <Title
          title={translations.title}
          description={translations.description}
        />
      </div>

      <div className="mb-8">
        <AvailablePlaces />
      </div>

      <div className="flex flex-col md:flex-row mx-4 mt-4 md:mt-0 md:mx-16 mb-16">
        <PricingList />
      </div>
      <CustomersCarousel />
      <div className="mt-8 md:mt-24">
        <Faq />
      </div>
    </>
  );
}

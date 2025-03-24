import PricingList from "./PricingList";
import Title from "./Title";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const Pricing = () => {
  const t = useTranslations("pricing");
  return (
    <>
      <div className="flex flex-col md:flex-row items-center mx-4 md:mx-16">
        <Image
          className="md:absolute md:mb-0"
          src="/halfOrange.svg"
          alt="halfOrange"
          width={100}
          height={100}
        />
        <Title title={t("title")} description={t("description")} />
      </div>

      <div className="flex flex-col md:flex-row mx-4 mt-4 md:mt-0 md:mx-16 mb-16">
        <PricingList />
      </div>
    </>
  );
};

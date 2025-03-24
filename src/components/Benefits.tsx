import Image from "next/image";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";

interface Benefit {
  title: string;
  description: string;
}

export default function Benefits() {
  const t = useTranslations("howItWorks");
  const benefits = t.raw("benefits.benefits") as Benefit[];

  return (
    <>
      <Title title={t("benefits.title")} highlightIndexes={[1]} />
      <div className="max-w-5xl w-full mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className="flex flex-col items-center p-4">
              <Image
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
                src={`/benefits/benefit${index + 1}.svg`}
                alt={benefit.title}
                width={100}
                height={100}
              />
              <h3 className="text-lg sm:text-xl font-medium mt-4 text-center">
                {benefit.title}
              </h3>
              <p className="text-gray-500 text-sm mt-4 text-center max-w-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

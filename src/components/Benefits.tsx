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
      <div className="max-w-5xl w-full mx-auto px-4 pb-12 flex md:flex-row justify-center text-center gap-4">
        {benefits.map((benefit, index) => (
          <div key={benefit.title}>
            <Image
              className="w-20 h-20 mx-auto"
              src={`/benefits/benefit${index + 1}.svg`}
              alt={benefit.title}
              width={100}
              height={100}
            />
            <h3 className="text-xl font-medium mt-4">{benefit.title}</h3>
            <p className="text-gray-500 text-sm mt-4">{benefit.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

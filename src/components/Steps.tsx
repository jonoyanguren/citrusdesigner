import { useTranslations } from "next-intl";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { HiMiniSparkles } from "react-icons/hi2";

const caveat = Caveat({ subsets: ["latin"] });

interface Step {
  title: string;
  description: string;
}

export default function Steps() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps.steps") as Step[];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-evenly relative px-4 md:px-0 gap-8 md:gap-0">
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
            className="w-full md:w-1/2 flex flex-col items-center gap-6 py-6 px-2"
          >
            <div className="flex items-start gap-3 justify-center relative -ml-8">
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
              {index === 1 && (
                <div className="absolute -bottom-2 -right-6">
                  <Image
                    src="/steps/plane.svg"
                    alt={step.title}
                    width={50}
                    height={50}
                  />
                </div>
              )}
              {index === 2 && (
                <div className="absolute -top-8 -right-6">
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
            {index === 1 && (
              <div className="flex items-center gap-2 border border-orange-400 rounded-full px-2 py-1">
                <HiMiniSparkles className="text-primary text-orange-400" />
                <p className="text-sm text-gray-900">
                  {t("steps.infiniteDesigns")}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

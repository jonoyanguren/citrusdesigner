import { useTranslations } from "next-intl";
import Image from "next/image";

export const Features = () => {
  const t = useTranslations("features");
  const features = t.raw("items") as string[];
  return (
    <div className="max-w-6xl mx-auto bg-yellow-50 w-full pt-24 pb-8 px-4 relative rounded-2xl mt-32 mb-16">
      {/* Wave */}
      <div className="absolute inset-0 z-0">{wave()}</div>

      {/* Content */}
      <div className="relative z-10">
        {/* Fresh */}
        <div className="float-right">
          <Image src="/fresh.png" alt="fresh" width={200} height={200} />
        </div>

        {/* Text */}
        <div className="max-w-2xl ml-32">
          <h2 className="text-xl font-bold text-left mb-8 text-gray-900">
            {t("title")}
          </h2>

          {/* Straw */}
          <div className="absolute bottom-16 -left-24 -rotate-[60deg] z-10">
            <Image src="/straw.png" alt="Straw" width={255} height={255} />
          </div>

          {/* Features */}
          <div className="max-w-2xl">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white py-2 px-4 rounded-full border border-black text-center inline-block mr-3 mb-3"
              >
                <p className="text-xs text-gray-900">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WAVE_PATH =
  "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

const wave = () => {
  return (
    <svg
      viewBox="0 0 1440 320"
      fill="#E6F6FF"
      className="h-full w-full"
      preserveAspectRatio="none"
    >
      <path d={WAVE_PATH} />
    </svg>
  );
};

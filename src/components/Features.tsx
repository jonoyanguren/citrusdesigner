import { useTranslations } from "next-intl";
import Image from "next/image";

export const Features = () => {
  const t = useTranslations("features");
  const features = t.raw("items") as string[];
  return (
    <div className="relative">
      {/* Straw */}
      <div className="hidden md:block absolute -left-24 top-24 -rotate-[60deg] z-20">
        <Image src="/straw.png" alt="Straw" width={255} height={255} />
      </div>

      {/* Main container with waves */}
      <div className="max-w-6xl w-[90%] mx-auto bg-yellow-50 md:w-full pt-12 md:pt-24 pb-8 px-8 md:px-4 relative rounded-2xl mt-4 md:mt-32 mb-8 md:mb-16 overflow-hidden">
        {/* Waves */}
        <div className="absolute inset-0 z-0">
          <div className="wave-container">
            <div className="wave wave1">{wave("#D4EFFF")}</div>
            <div className="wave wave2">{wave("#E6F6FF")}</div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Fresh */}
          <div className="absolute right-0 -bottom-8 md:bottom-0 md:relative md:float-right mb-4 md:mb-0">
            <Image
              src="/fresh.png"
              alt="fresh"
              width={200}
              height={200}
              className="w-32 md:w-auto"
            />
          </div>

          {/* Text */}
          <div className="max-w-3xl ml-0 md:ml-32 pr-16 md:pr-0">
            <h2 className="text-lg md:text-xl font-bold text-left mb-6 md:mb-8 text-gray-900">
              {t("title")}
            </h2>

            {/* Features */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white py-2 px-2 md:px-4 rounded-full border border-black text-center"
                >
                  <p className="text-sm text-gray-900">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          .wave-container {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          .wave {
            position: absolute;
            width: 200%;
            height: 100%;
            animation: wave 18s linear infinite;
            opacity: 0.8;
          }

          .wave2 {
            animation: wave 12s linear infinite;
            opacity: 0.5;
          }

          @keyframes wave {
            0% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

const WAVE_PATH =
  "M0,260L48,276C96,292,192,324,288,329.3C384,335,480,313,576,292C672,271,768,249,864,254.7C960,260,1056,292,1152,297.3C1248,303,1344,281,1392,270.7L1440,260L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

const wave = (color: string = "#E6F6FF") => {
  return (
    <svg
      viewBox="0 0 1440 320"
      fill={color}
      className="h-full w-full"
      preserveAspectRatio="none"
    >
      <path d={WAVE_PATH} />
    </svg>
  );
};

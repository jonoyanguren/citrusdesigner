import { useTranslations } from "next-intl";
import Button from "./Button";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProjectsSummary() {
  const t = useTranslations("projectsSummary");
  const { locale } = useParams();
  const leftPositions = [
    {
      top: "-10%",
      left: "-25%",
      width: "75%",
      height: "70%",
      zIndex: 1,
      rotate: "-5deg",
    },
    {
      top: "45%",
      left: "-10%",
      width: "75%",
      height: "70%",
      zIndex: 2,
      rotate: "3deg",
    },
  ];

  const rightPositions = [
    {
      top: "20%",
      right: "-15%",
      width: "75%",
      height: "70%",
      zIndex: 2,
      rotate: "-3deg",
    },
  ];

  return (
    <div className="h-[345px] max-w-7xl my-16 w-full bg-gradient-to-r from-orange-300 via-orange-100 to-orange-300 rounded-2xl flex flex-col md:flex-row items-center justify-between relative overflow-visible">
      {/* Left side project images */}
      <div className="hidden md:block absolute left-0 w-[40%] h-full">
        {[2, 3].map((num, index) => (
          <div
            key={`left-${num}`}
            className="absolute transform transition-all duration-300 hover:z-30"
            style={{
              position: "absolute",
              width: leftPositions[index].width,
              height: leftPositions[index].height,
              top: leftPositions[index].top,
              left: leftPositions[index].left,
              zIndex: leftPositions[index].zIndex,
              transform: `rotate(${leftPositions[index].rotate})`,
            }}
          >
            <Image
              src={`/projects/project${num}.png`}
              alt={`Project ${num}`}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>

      {/* Center content */}
      <div className="text-center z-20 px-8 max-w-[100%] md:max-w-[50%] mx-auto">
        <h2 className="text-4xl font-semibold mb-8 text-center">
          {t("title")}
        </h2>
        <Button
          href={`/${locale}/how-it-works#projects`}
          variant="secondary"
          className="px-8"
        >
          {t("button")}
        </Button>
      </div>

      {/* Right side project images */}
      <div className="hidden md:block absolute right-0 w-[40%] h-full">
        {[4].map((num, index) => (
          <div
            key={`right-${num}`}
            className="absolute transform transition-all duration-300 hover:z-30"
            style={{
              position: "absolute",
              width: rightPositions[index].width,
              height: rightPositions[index].height,
              top: rightPositions[index].top,
              right: rightPositions[index].right,
              zIndex: rightPositions[index].zIndex,
              transform: `rotate(${rightPositions[index].rotate})`,
            }}
          >
            <Image
              src={`/projects/project${num > 4 ? (num % 4) + 1 : num}.png`}
              alt={`Project ${num}`}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

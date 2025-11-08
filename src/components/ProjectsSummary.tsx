"use client";
import { useTranslations } from "next-intl";
import Button from "./Button";
import Image from "next/image";

export default function ProjectsSummary() {
  const t = useTranslations("projectsSummary");

  // Project images mapping
  const projectImages = [
    { path: "/projects/2-bbscafe/bbs0.png", alt: "BBs Café" },
    { path: "/projects/3-homeprive/homeprive0.png", alt: "Homeprive" },
    { path: "/projects/4-tenvinilo/tenvinilo0.png", alt: "Tenvinilo" },
  ];

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

  // Mobile fan-like image positions
  const mobilePositions = [
    {
      top: "-20%",
      left: "40%",
      width: "60%",
      height: "80%",
      zIndex: 3,
      rotate: "-15deg",
      translateX: "-50%",
    },
    {
      top: "-15%",
      left: "60%",
      width: "60%",
      height: "80%",
      zIndex: 2,
      rotate: "0deg",
      translateX: "-50%",
    },
    {
      top: "-5%",
      left: "50%",
      width: "60%",
      height: "80%",
      zIndex: 1,
      rotate: "15deg",
      translateX: "-50%",
    },
  ];

  return (
    <div className="h-auto w-[90%] md:w-[80%] pb-16 md:mb-0 md:h-[345px] max-w-[100%] md:max-w-[80%] my-16 bg-gradient-to-r from-orange-300 via-orange-100 to-orange-300 rounded-2xl flex flex-col md:flex-row items-center justify-between relative overflow-visible pt-[220px] md:pt-0 md:pb-0">
      {/* Mobile images (fan arrangement) */}
      <div className="block md:hidden absolute top-0 left-0 w-full h-[250px]">
        {projectImages.map((project, index) => (
          <div
            key={`mobile-${index}`}
            className="absolute transform transition-all duration-300"
            style={{
              position: "absolute",
              width: mobilePositions[index].width,
              height: mobilePositions[index].height,
              top: mobilePositions[index].top,
              left: mobilePositions[index].left,
              zIndex: mobilePositions[index].zIndex,
              transform: `translateX(${mobilePositions[index].translateX}) rotate(${mobilePositions[index].rotate})`,
            }}
          >
            <Image
              src={project.path}
              alt={project.alt}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>

      {/* Left side project images (desktop only) */}
      <div className="hidden md:block absolute left-0 w-[40%] h-full">
        {projectImages.slice(0, 2).map((project, index) => (
          <div
            key={`left-${index}`}
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
              src={project.path}
              alt={project.alt}
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
          href={`/how-it-works#projects`}
          variant="secondary"
          className="px-8"
        >
          {t("button")}
        </Button>
      </div>

      {/* Right side project images (desktop only) */}
      <div className="hidden md:block absolute right-0 w-[40%] h-full">
        {projectImages.slice(2, 3).map((project, index) => (
          <div
            key={`right-${index}`}
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
              src={project.path}
              alt={project.alt}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

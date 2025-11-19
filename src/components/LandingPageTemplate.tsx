"use client";

import { LandingPageData, LandingSection, Locale } from "@/types/landing";
import Image from "next/image";
import { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import Button from "./Button";
import DecorativeElements from "./DecorativeElements";
import MobileDecorativeElements from "./MobileDecorativeElements";

const confettiColors = ["#D0ECFB", "#FFCF0F", "#5955FF"];

const generateRandomConfetti = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    const isPill = Math.random() > 0.5;
    const color =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const rotation = Math.random() * 360;

    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;

    const width = isPill
      ? `${Math.random() * 18 + 8}px`
      : `${Math.random() * 16 + 7}px`;
    const height = isPill ? `${Math.random() * 4 + 2}px` : width;

    return (
      <div
        key={index}
        className={`absolute rounded-full transform`}
        style={{
          backgroundColor: color,
          left,
          top,
          width,
          height,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    );
  });
};

type Props = {
  landingData: LandingPageData;
  locale: Locale;
};

// Icon mapping helper for dynamic icons from JSON
const getIcon = (iconName: string | undefined): IconType | null => {
  if (!iconName) return null;

  // Try to find icon in react-icons/fa (includes FaReg* icons)
  const FaIcon = (FaIcons as Record<string, IconType>)[iconName];
  if (FaIcon) return FaIcon;

  // Try to find icon in react-icons/fa6
  const Fa6Icon = (Fa6Icons as Record<string, IconType>)[iconName];
  if (Fa6Icon) return Fa6Icon;

  // Try to find icon in react-icons/hi
  const HiIcon = (HiIcons as Record<string, IconType>)[iconName];
  if (HiIcon) return HiIcon;

  // Try to find icon in react-icons/hi2
  const Hi2Icon = (Hi2Icons as Record<string, IconType>)[iconName];
  if (Hi2Icon) return Hi2Icon;

  return null;
};

export function LandingPageTemplate({ landingData, locale }: Props) {
  const getText = (text: { en: string; es: string }) => text[locale];

  const renderSection = (section: LandingSection, index: number) => {
    switch (section.type) {
      case "hero":
        const titleText = getText(section.title);
        const words = titleText.split(" ");
        const halfIndex = Math.ceil(words.length / 2);
        const firstHalf = words.slice(0, halfIndex).join(" ");
        const secondHalf = words.slice(halfIndex).join(" ");

        return (
          <section
            key={index}
            className="relative flex min-h-[75vh] md:min-h-0 items-center justify-center overflow-hidden bg-yellow-100"
          >
            <DecorativeElements />
            <MobileDecorativeElements />
            {section.backgroundImage && (
              <div className="absolute inset-0">
                <Image
                  src={section.backgroundImage}
                  alt={titleText}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            )}
            <div className="p-6 md:p-24 relative" suppressHydrationWarning>
              <div className="w-full md:max-w-3xl mx-auto">
                {section.badge && (
                  <div className="text-center mb-8">
                    <span className="inline-block px-4 py-2 text-sm font-semibold bg-white text-gray-900 rounded-full shadow-lg">
                      <span className="w-2 h-2 bg-orange-500 rounded-full inline-block mr-2"></span>
                      {getText(section.badge)}
                    </span>
                  </div>
                )}
                <h1 className="text-6xl md:text-6xl md:leading-[64px] font-bold mb-6 text-center text-gray-900">
                  {firstHalf}{" "}
                  <span className="text-orange-500 mx-2 px-2 font-bold text-5xl mt-2 md:mt-0 md:text-6xl leading-none inline-block rounded-sm">
                    {secondHalf}
                  </span>
                </h1>
                {section.subtitle && (
                  <p className="max-w-2xl text-2xl mx-auto md:text-2xl text-gray-900 text-center mb-6">
                    {getText(section.subtitle)}
                  </p>
                )}
                {section.cta && (
                  <div className="flex justify-center gap-4 md:gap-8">
                    <Button
                      className="flex items-center gap-2 py-5 px-8 bg-orange-500 text-white hover:bg-orange-600"
                      href={section.cta.href}
                      variant={section.cta.variant || "primary"}
                    >
                      <span className="text-xl">
                        {getText(section.cta.text)}
                      </span>
                      <FaArrowRight />
                    </Button>
                  </div>
                )}
                {section.text && (
                  <p className="mt-4 mx-auto md:text-sm text-gray-900 text-sm text-center mb-6">
                    {getText(section.text)}
                  </p>
                )}
              </div>
            </div>
          </section>
        );

      case "painpoints":
        return (
          <section key={index} className="py-12 md:py-12 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-5xl md:text-5xl md:leading-[64px] max-w-4xl mx-auto font-bold mb-6 text-center text-gray-900">
                  {getText(section.title)}
                </h2>
              </div>
              <div>
                {section.items.map((item, itemIndex) => {
                  // Use dynamic icon if provided, otherwise use default FaXmark
                  const DynamicIcon = item.icon ? getIcon(item.icon) : null;
                  return (
                    <div
                      key={itemIndex}
                      className="border-l-orange-500 border-l-4 flex flex-row items-center  bg-gray-100 max-w-3xl m-8 rounded-xl mx-auto p-6 hover:shadow-lg transition-shadow"
                    >
                      {DynamicIcon ? (
                        <DynamicIcon className="text-orange-500 text-xl flex-shrink-0 ml-2" />
                      ) : (
                        <FaXmark className="text-orange-500 text-xl flex-shrink-0 ml-2" />
                      )}
                      <p className="ml-4 text-left md:text-xl text-gray-900 text-xl">
                        {getText(item.text)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case "info":
        return (
          <section key={index} className="py-12 md:py-12 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-6xl md:text-5xl md:leading-[64px] font-bold mb-8 text-center text-gray-900">
                {getText(section.title)}
              </h2>
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {section.items.map((item, itemIndex) => {
                  // Use dynamic icon if provided
                  const DynamicIcon = item.icon ? getIcon(item.icon) : null;
                  return (
                    <div
                      key={itemIndex}
                      className="py-12  bg-orange-50 border border-orange-400 rounded-xl"
                    >
                      {DynamicIcon && (
                        <div className="text-center text-4xl mb-4 bg-orange-500 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center">
                          <DynamicIcon className="text-white text-2xl" />
                        </div>
                      )}
                      <p className="mt-4 mx-auto md:text-2xl text-gray-900 text-2xl text-center mb-6">
                        {getText(item.text)}
                      </p>
                      {item.subtext && (
                        <p className="mt-4 mx-auto md:text-lg text-gray-700 text-lg text-center">
                          {getText(item.subtext)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case "benefits":
        return (
          <section
            key={index}
            className="relative w-full px-6 bg-orange-400 py-20 overflow-hidden col-span-2"
          >
            {generateRandomConfetti(20)}
            <div className="max-w-5xl mx-auto relative">
              <div className="relative z-10">
                <h2 className="text-5xl md:text-5xl md:leading-[64px] mb-12 text-center text-white bg-orange-400 px-2 md:px-6">
                  {getText(section.title)}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-0 md:gap-8">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="py-4 px-6 bg-white rounded-xl"
                    >
                      <p className="flex flex-row gap-2 text-gray-900 text-left text-xl min-h-12 px-4 md:px-0">
                        <FaCheck className="text-orange-500 mr-2 text-xl flex-shrink-0 justify-self-start items-start mt-1" />
                        {getText(item.text)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case "example":
        return (
          <section
            key={index}
            className="py-16 md:py-24 px-4 md:px-8 bg-white relative overflow-visible pb-40"
          >
            <div className="max-w-7xl mx-auto container px-4 relative">
              <div className="absolute top-0 -left-5 z-0 pointer-events-none">
                <ArrowVertical />
              </div>
              <div className="absolute -bottom-20 -right-20 z-0 pointer-events-none">
                <ArrowHorizontal />
              </div>
              <h2 className="text-5xl md:text-5xl md:leading-[64px] max-w-3xl mx-auto font-bold mb-16 text-center text-gray-900">
                {getText(section.title)}
              </h2>
              <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Left Column - Cards */}
                <div className="flex flex-col gap-8 w-full md:w-[40%]">
                  {/* White Card */}
                  <div className="bg-white border shadow-xl rounded-lg p-8">
                    <h3 className="text-2xl md:text-2xl text-left text-gray-900 mb-4">
                      {getText(section.cardWhite.title)}
                    </h3>
                    <div className="space-y-2">
                      {section.cardWhite.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex flex-row items-start gap-2"
                        >
                          <FaXmark className="text-orange-500 text-xl flex-shrink-0 mt-1" />
                          <p className="md:text-lg text-gray-600 text-lg text-left">
                            {getText(item)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Orange Card */}
                  <div className="bg-orange-400 rounded-lg p-8 shadow-xl">
                    <h3 className="text-2xl md:text-2xl text-left text-white mb-4">
                      {getText(section.cardOrange.title)}
                    </h3>
                    <div className="space-y-2">
                      {section.cardOrange.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex flex-row items-start gap-2"
                        >
                          <FaCheck className="text-white text-xl flex-shrink-0 mt-1" />
                          <p className="md:text-lg text-white text-lg text-left">
                            {getText(item)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Right Column - Image */}
                {section.image && (
                  <div className="relative w-full md:w-[65%] mt-4">
                    <Image
                      src={section.image}
                      alt={getText(section.title)}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case "cta":
        return (
          <section
            key={index}
            className="py-16 md:py-24 px-4 md:px-8 bg-gray-900 border-b border-white"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-5xl md:text-5xl md:leading-[64px] font-bold mb-8 text-center text-white">
                {getText(section.title)}
              </h2>
              {section.subtitle && (
                <p className="max-w-4xl text-2xl mx-auto md:text-2xl text-white text-center mb-8">
                  {getText(section.subtitle)}
                </p>
              )}
              <div className="flex justify-center gap-4 md:gap-8">
                <Button
                  className="flex items-center gap-2 py-5 px-8 bg-orange-500 text-white hover:bg-orange-600 mb-8"
                  href={section.cta.href}
                  variant={section.cta.variant || "primary"}
                >
                  <span className="text-xl">{getText(section.cta.text)}</span>
                  <FaArrowRight />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-4 flex flex-row items-center justify-center gap-2"
                  >
                    <FaCheck className="text-orange-500 text-xl flex-shrink-0" />
                    <p className="md:text-sm text-white text-sm text-center">
                      {getText(item)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
    }
  };

  return (
    <div className="min-h-screen overflow-visible">
      {landingData.sections.map((section, index) =>
        renderSection(section, index)
      )}
    </div>
  );
}

const ArrowVertical = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="67"
    height="157"
    viewBox="0 0 67 157"
    fill="none"
  >
    <path
      d="M60.3755 138C58.5355 133.69 57.1655 127.77 53.3755 125.01C54.4755 130.71 56.8255 136.78 60.8755 141C61.9755 135.49 66.3455 146.87 66.3855 147.6C66.6155 151.48 59.5355 157.24 55.0655 155.83C52.2655 154.95 45.9855 142.94 43.8155 140.07C40.0955 135.15 34.9855 130.71 31.8755 125.03C29.5755 124.97 22.9055 140.21 21.0455 142.68C20.6255 143.24 12.4655 151.69 11.9055 152.04C4.8855 156.46 4.35549 152.65 3.36549 146L0.375473 147.01C-1.95453 144.19 7.23547 128.47 9.37547 125.52C10.7555 123.62 17.3455 118.89 16.1755 117.17C16.0455 116.98 14.4055 117.08 14.2955 116.44C13.5155 111.8 24.3555 102.04 27.3955 98.5001C28.7055 96.9801 27.6055 94.55 30.9755 94.34C39.9955 93.76 39.9455 100.09 43.3455 104.53C47.7855 110.33 63.2555 128.62 62.3755 135.46C62.2255 136.63 61.6655 137.85 60.3755 138.02V138Z"
      fill="#FDBA74"
    />
    <path
      d="M57.3556 66C55.4156 68.2 55.5356 61.94 53.3656 64.5C58.6856 72.89 63.5956 81.8 65.0956 91.76C65.2856 93.04 65.7856 97.45 65.2956 97.95C65.1056 98.15 60.1856 99.08 59.9156 99.06C58.8256 99 60.0656 96.55 58.3756 97.01C58.8356 100 58.1756 100.89 55.0456 99.82C52.9356 99.09 47.3356 87.2 48.3556 84.01L46.3756 86C43.4156 80.11 39.6656 74.64 38.3556 68.01C37.2256 67.12 21.6156 88.2 19.8756 90.02C17.4756 92.53 11.9656 98.58 8.6656 97.27C1.9956 94.63 3.57561 85.51 6.46562 80.6C7.68562 78.52 13.4656 70.96 15.3856 68.52C21.1256 61.25 28.3956 55.25 34.1056 47.97C37.1456 45.57 44.2356 45.69 47.3256 47.53C49.2556 48.68 58.3656 64.85 57.3556 65.99V66Z"
      fill="#FDBA74"
    />
    <path
      d="M61.2455 30.9C60.9255 31.27 59.2255 30.53 59.3655 31.5C61.6055 33.21 68.2955 40.7701 61.3555 40.0101L63.3655 46C56.9055 47.87 55.7655 45.4001 52.0955 40.7601C49.7955 37.84 48.9655 37.26 47.2955 35.36C46.0155 33.9 41.3355 23.0401 39.8555 23.0201C38.7555 25.7701 34.9755 26.0601 33.9255 27.0201C29.2755 31.2401 23.7255 43.59 18.0855 47.23C16.0755 48.52 13.7855 49.2301 11.3655 49.0101V44.0101L8.36551 45.0201C7.51551 44.0201 10.4455 41.0401 5.37549 42.5201C10.2755 34.2501 15.1455 24.71 20.9455 17.1C23.3455 13.94 35.8355 0.0300406 38.8755 4.06408e-05C41.9555 -0.0399594 62.5055 29.46 61.2355 30.91L61.2455 30.9Z"
      fill="#FDE047"
    />
  </svg>
);

const ArrowHorizontal = () => (
  <svg
    width="283"
    height="77"
    viewBox="0 0 283 77"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M271.79 19.1248L270.82 21.0448C274.63 20.4948 277.3 23.3948 280.82 24.0648L277.84 26.0347C285.75 28.1947 279.78 35.5948 279.77 38.5048C279.77 39.1448 281.42 39.0347 281.83 39.7147C286.21 47.0447 277 49.7147 272.58 53.0247C271.44 53.8747 271.12 55.6248 269.81 56.5048C264.43 60.1348 252.92 66.3148 246.48 65.0748C245.61 64.9048 246.25 62.8248 244.41 63.0048C242.18 63.2248 237.92 66.5948 236.04 65.8248C232.53 64.3848 235.19 54.4747 237.13 52.3447C240.77 48.3547 252.35 43.5448 257.15 39.8748C258 39.2248 259.13 38.9548 258.83 37.5548C253.24 34.6948 248.93 30.0947 243.97 26.4047C242.09 25.0147 239.61 24.9148 238.11 23.7548C232.01 19.0548 236.73 9.02477 244.02 9.24477C251.61 9.47477 264.67 16.0348 271.78 19.1148L271.79 19.1248ZM248.83 62.0648C247.43 61.3448 246.16 62.6948 246.84 63.0448C248.24 63.7648 249.51 62.4148 248.83 62.0648Z"
      fill="#B3D4E1"
    />
    <path
      d="M183.83 7.05476C182.68 7.26476 182.6 9.25476 182.83 10.0548C183.92 13.8148 193.27 19.4848 196.31 22.0748C199.14 24.4948 203.15 29.0948 205.83 31.0548C206.76 31.7348 207.05 31.6948 207.83 32.0548C208.46 32.3448 209.26 32.9248 209.83 33.0548C210.68 33.2448 211.89 32.9248 212.83 33.0548C214.52 34.8448 218.6 36.5647 221.24 40.1447C229.56 51.3847 221.4 50.8548 213.89 55.6148C205.27 61.0748 196.69 67.1147 188.79 73.5847C182.22 74.5747 180.08 68.6148 184.83 64.0648L179.83 65.0447C181.31 62.5147 179.74 59.7947 180.03 57.7747C180.77 52.7347 187.95 49.6048 190.81 45.5548C183.56 38.2648 176.37 31.6048 174.32 21.0748C173.73 18.0448 175.57 12.6048 171.82 11.5548L175.83 12.0447C174.56 9.09475 171.4 7.43472 174.92 4.64472C182.16 -1.09528 180.94 4.92476 183.83 7.05476Z"
      fill="#FB923C"
    />
    <path
      d="M9.93001 75.9946C7.87001 71.5546 3.06 68.9646 6.13 63.3646L30.82 46.0746L21.83 45.0546L25.82 42.0746C15.96 36.3546 7.09 28.0446 0 19.7646C2.78 17.7946 0.26 14.7646 1.25 13.0646C2.24 11.3646 6.97 10.3946 8.78 11.5946C15.92 17.7546 24.61 21.8546 32.3 27.0946C37.34 30.5346 42.52 33.7646 47.37 37.0346C55.34 42.4046 52.92 49.0846 47.8 55.5346C42.5 57.3246 12.45 77.7946 9.94 76.0046L9.93001 75.9946Z"
      fill="#EAB308"
    />
    <path
      d="M126.83 6.05475C127.47 7.07475 123.84 8.27475 128.83 12.0547C133.4 15.5147 137.91 19.5647 142.83 23.0547C144.32 24.1047 145.86 23.7847 146.91 24.7247C148.53 26.1747 149.48 31.2448 150.06 31.8248C150.84 32.6048 153.27 32.2747 154.25 32.9547C156.17 34.2747 152.32 34.9047 157.83 36.0547C158.17 36.1247 158.56 35.9548 158.83 36.0547L159.83 38.0547C161.77 39.7747 164.05 38.4847 162.82 44.5347C161.85 49.3047 142.89 57.1448 140.27 62.9948C132.28 68.8347 118.81 78.1148 121.35 60.0748L141.82 41.5648C138.13 38.1548 132.57 34.6948 129.3 31.0748C127.12 28.6648 126.13 25.2547 124.51 23.3647C122.31 20.7847 115.32 17.1548 115.04 12.7448C115 12.0648 115.8 11.4048 115.82 11.0648C116 8.36476 116.01 3.06473 119.51 2.16473C120.44 1.92473 126.6 5.71476 126.82 6.06476L126.83 6.05475Z"
      fill="#FDBA74"
    />
    <path
      d="M80.8297 20.0547C81.1697 20.2547 81.4397 20.8247 81.8297 21.0547C79.3497 24.1647 86.6397 29.5847 88.8297 31.0547C89.4397 31.4647 89.8697 32.1247 90.8297 32.0547C91.1997 32.3347 91.4697 32.8047 91.8297 33.0547C91.3497 35.6347 98.3997 43.2447 99.8297 41.0547H100.83C100.91 41.3647 100.77 41.7247 100.83 42.0547C100.89 42.3847 100.78 42.7247 100.83 43.0547C101.05 44.6247 100.66 46.4447 100.83 48.0547L103.82 47.0547C105.13 55.1347 93.3597 58.2148 87.5297 61.0648C86.8897 61.3748 86.8297 62.7047 85.5597 63.3347C82.9797 64.6147 75.2797 66.6147 73.8297 63.5347C72.8797 61.5247 75.7097 62.1547 75.8197 62.0347C75.9997 60.9247 74.8697 61.0947 74.8197 61.0447C74.4897 60.6947 74.1797 60.3647 73.8197 60.0447C72.7097 59.0447 70.6897 59.0347 72.3097 57.0347C74.5797 54.2447 82.4697 52.0147 84.8197 49.0447C84.9597 48.8647 84.7097 48.3747 84.8197 48.0447C86.1197 44.2047 83.2497 45.1248 80.7597 42.5748C76.5097 38.2348 75.0697 36.8047 70.3297 33.0347C65.5897 29.2647 67.6597 26.9947 65.7597 22.8047C65.3097 21.8047 63.2397 21.7747 63.0197 19.3547C62.8897 17.8547 63.5497 14.8147 63.8197 13.0347C64.0297 11.6347 63.8897 10.2547 64.8197 9.03473C65.0797 8.93473 65.4697 9.09473 65.8197 9.03473L78.3197 19.0748C78.9397 19.8448 80.2897 19.7047 80.8197 20.0347L80.8297 20.0547Z"
      fill="#FDE047"
    />
    <path
      d="M103.83 47.0547C103.96 47.2347 106.48 46.0347 105.84 49.4847C105.07 53.6047 84.7798 65.3747 80.1398 67.8547C74.5298 70.8447 66.7298 75.7647 60.8398 72.0547C64.7398 67.7347 70.4198 65.5947 73.8398 61.0547H74.8398C74.8898 61.1047 76.0198 60.9347 75.8398 62.0447C75.7298 62.1547 72.9098 61.5347 73.8498 63.5447C75.2998 66.6147 83.0098 64.6247 85.5798 63.3447C86.8498 62.7147 86.9098 61.3847 87.5498 61.0747C93.3798 58.2247 105.15 55.1447 103.84 47.0647L100.85 48.0647C100.67 46.4547 101.06 44.6447 100.85 43.0647H101.85C102.95 44.4647 103.35 46.4047 103.85 47.0647L103.83 47.0547Z"
      fill="#FDE047"
    />
    <path
      d="M84.8298 49.0547C82.4798 52.0147 74.5898 54.2447 72.3198 57.0447C70.6998 59.0447 72.7198 59.0547 73.8298 60.0547V61.0547C67.0398 60.9547 64.3998 67.3847 58.8298 69.0547C58.7298 68.7747 58.9198 68.3747 58.8298 68.0547C60.5698 63.0547 61.4898 61.3947 65.8298 58.0547C71.9898 54.7047 77.9698 50.8847 84.8298 49.0547Z"
      fill="#FDE047"
    />
    <path
      d="M207.83 31.0547V32.0547C207.05 31.6947 206.76 31.7347 205.83 31.0547H207.83Z"
      fill="#FB923C"
    />
    <path
      d="M212.83 33.0547C211.89 32.9247 210.68 33.2447 209.83 33.0547C209.66 31.9947 208.11 31.4747 207.83 31.0547C202.22 22.4347 192.2 14.6247 182.83 10.0547C182.6 9.25469 182.68 7.26469 183.83 7.05469C184.77 7.74469 187.86 8.12469 189.77 9.62469C198.75 16.6847 205.34 25.1247 212.83 33.0547Z"
      fill="#FB923C"
    />
    <path
      d="M115.83 11.0547C111.12 8.85468 117.1 0.114687 118.46 0.00468727C120.43 -0.165313 126.58 4.33467 126.83 6.05468C136.68 12.7247 145.29 22.0347 153.88 30.5347C155.04 31.6847 157.58 34.3447 157.83 36.0547C152.32 34.8947 156.17 34.2646 154.25 32.9546C153.26 32.2746 150.83 32.6047 150.06 31.8247C149.49 31.2447 148.53 26.1747 146.91 24.7247C145.86 23.7847 144.32 24.1047 142.83 23.0547C139.36 18.7447 134.92 15.2447 130.83 11.5547C129.34 10.2147 128.63 8.73468 128.83 12.0547C123.84 8.27468 127.47 7.07468 126.83 6.05468C126.61 5.70468 120.44 1.91465 119.52 2.15465C116.02 3.05465 116.02 8.36468 115.83 11.0547Z"
      fill="#FDBA74"
    />
    <path
      d="M93.83 34.0547C94.18 34.3647 94.49 34.7347 94.83 35.0547C96.44 36.5947 98.32 39.2647 99.83 41.0547C98.4 43.2447 91.35 35.6347 91.83 33.0547C92.4 33.4647 93.38 33.6547 93.83 34.0547Z"
      fill="#FACC15"
    />
    <path
      d="M63.8299 13.0547C63.5599 14.8347 62.8999 17.8747 63.0299 19.3747C63.2399 21.7947 65.3099 21.8247 65.7699 22.8247C67.6699 27.0147 65.4899 29.2047 70.3399 33.0547C75.1899 36.9047 76.5199 38.2547 80.7699 42.5947C83.2599 45.1447 86.1299 44.2147 84.8299 48.0647L65.3699 29.0247C64.4599 21.0847 59.7399 21.5547 61.8299 13.0647H63.8299V13.0547Z"
      fill="#FACC15"
    />
    <path
      d="M159.83 38.0547L158.83 36.0547C160.33 36.5847 159.66 37.9047 159.83 38.0547Z"
      fill="#FB923C"
    />
    <path
      d="M90.8301 32.0547C89.8701 32.1247 89.4401 31.4647 88.8301 31.0547C89.8401 30.9447 90.2101 31.5847 90.8301 32.0547Z"
      fill="#FACC15"
    />
  </svg>
);

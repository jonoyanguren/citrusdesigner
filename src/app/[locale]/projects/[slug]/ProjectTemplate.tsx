"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type ProjectData = {
  id: string;
  slug: string;
  title: string;
  heroImage: string;
  challenge: { en: string; es: string };
  approach: { en: string; es: string };
  location: { en: string; es: string };
  url: string;
  plan: { en: string; es: string };
  images: string[];
  imageBackgrounds?: {
    [key: string]: string;
  };
  defaultBackground?: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
  results: { en: string; es: string };
  testimonial: {
    text: { en: string; es: string };
    author: string;
    position: { en: string; es: string };
    image?: string;
  };
};

type Props = {
  project: ProjectData;
  locale: string;
  slug: string;
};

export function ProjectTemplate({ project, locale, slug }: Props) {
  const t = useTranslations("projectDetail");
  const lang = locale as "en" | "es";

  // Helper to build image paths
  const getImagePath = (imageName: string) => `/projects/${slug}/${imageName}`;

  // Helper to get background color for an image
  const getImageBackground = (imageName: string) => {
    if (project.imageBackgrounds && project.imageBackgrounds[imageName]) {
      return project.imageBackgrounds[imageName];
    }
    return project.defaultBackground || "#f3f4f6";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <Image
          src={getImagePath(project.heroImage)}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Challenge and Approach - Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-32 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {t("challenge")}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {project.challenge[lang]}
            </p>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {t("approach")}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {project.approach[lang]}
            </p>
          </div>
        </div>

        {/* Location and Plan - One row */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t("location")}
            </h3>
            <p className="text-gray-900">{project.location[lang]}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t("plan")}
            </h3>
            <p className="text-gray-900">{project.plan[lang]}</p>
          </div>
        </div>

        {/* Images Masonry Grid */}
        {project.images && project.images.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
              {t("gallery")}
            </h2>
            <div className="space-y-6">
              {/* First two images side by side */}
              {project.images.length >= 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg h-[500px] p-8"
                    style={{
                      backgroundColor: getImageBackground(project.images[0]),
                    }}
                  >
                    <Image
                      src={getImagePath(project.images[0])}
                      alt={`${project.title} - Image 1`}
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-300 p-4"
                    />
                  </div>
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg h-[500px] p-8"
                    style={{
                      backgroundColor: getImageBackground(project.images[1]),
                    }}
                  >
                    <Image
                      src={getImagePath(project.images[1])}
                      alt={`${project.title} - Image 2`}
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-300 p-4"
                    />
                  </div>
                </div>
              )}

              {/* Remaining images - full width */}
              {project.images.slice(2).map((image, index) => (
                <div
                  key={index + 2}
                  className="relative overflow-hidden rounded-lg shadow-lg h-[800px]"
                  style={{ backgroundColor: getImageBackground(image) }}
                >
                  <Image
                    src={getImagePath(image)}
                    alt={`${project.title} - Image ${index + 3}`}
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300 p-16"
                  />
                </div>
              ))}

              {/* Handle case with only one image */}
              {project.images.length === 1 && (
                <div
                  className="relative overflow-hidden rounded-lg shadow-lg h-[500px] p-8"
                  style={{
                    backgroundColor: getImageBackground(project.images[0]),
                  }}
                >
                  <Image
                    src={getImagePath(project.images[0])}
                    alt={`${project.title} - Image 1`}
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Before and After */}
        {project.beforeAfter && (
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
              {t("beforeAfter")}
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={getImagePath(project.beforeAfter.before)}
                      alt="Before"
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={getImagePath(project.beforeAfter.after)}
                      alt="After"
                    />
                  }
                  position={50}
                  style={{ height: "500px" }}
                  className="cursor-col-resize"
                />
              </div>
              <div className="flex justify-between mt-8">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900">{t("before")}</p>
                  <FaArrowRight className="text-gray-900" />
                </div>
                <div className="flex items-center gap-2">
                  <FaArrowLeft className="text-gray-900" />
                  <p className="font-bold text-gray-900">{t("after")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-16 mr-[35%]">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            {t("results")}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {project.results[lang]}
          </p>
        </div>

        {/* Testimonial */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          {t("testimonial")}
        </h2>
        <div className="border border-gray-300 shadow-sm rounded-2xl overflow-hidden">
          {project.testimonial.image ? (
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Text Column */}
              <div className="p-8 md:p-12 flex flex-col justify-center col-span-2">
                <p className="text-xl text-gray-500 italic mb-6">
                  &ldquo;{project.testimonial.text[lang]}&rdquo;
                </p>
                <p className="font-bold text-xl text-gray-900">
                  {project.testimonial.author}
                </p>
                <p className="text-gray-600">
                  {project.testimonial.position[lang]}
                </p>
              </div>

              {/* Image Column */}
              <div className="relative h-[300px] md:h-auto min-h-[400px]">
                <Image
                  src={getImagePath(project.testimonial.image)}
                  alt={project.testimonial.author}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="text-xl text-gray-500 italic mb-6">
                &ldquo;{project.testimonial.text[lang]}&rdquo;
              </p>
              <p className="font-bold text-xl text-gray-900">
                {project.testimonial.author}
              </p>
              <p className="text-gray-600">
                {project.testimonial.position[lang]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

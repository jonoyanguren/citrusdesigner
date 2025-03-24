"use client";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProjectCard from "./ProjectCard";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: {
    id: string;
    name: string;
  }[];
}

export const OurProjects = () => {
  const t = useTranslations();
  const projects = t.raw("projects.items") as Project[];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left side - Description */}
          <div className="flex flex-col justify-center lg:col-span-1">
            <h2 className="text-5xl font-bold mb-6">{t("projects.title")}</h2>
            <p className="text-2xl text-gray-400 mb-8">
              {t("projects.description")}
            </p>

            {/* Carousel Controls */}
            <div className="flex gap-4">
              <button
                onClick={scrollPrev}
                className="p-4 rounded-full bg-gray-100 shadow-lg transition-colors"
                aria-label="Previous slide"
              >
                <FaArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={scrollNext}
                className="p-4 rounded-full bg-gray-100 shadow-lg transition-colors"
                aria-label="Next slide"
              >
                <FaArrowRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right side - Carousel */}
          <div className="overflow-hidden lg:col-span-2" ref={emblaRef}>
            <div className="flex">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] mr-6"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

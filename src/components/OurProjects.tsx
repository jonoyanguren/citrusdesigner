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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Description */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-6">{t("projects.title")}</h2>
            <p className="text-gray-600 mb-8">{t("projects.description")}</p>

            {/* Carousel Controls */}
            <div className="flex gap-4">
              <button
                onClick={scrollPrev}
                className="p-4 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="Previous slide"
              >
                <FaArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollNext}
                className="p-4 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="Next slide"
              >
                <FaArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right side - Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)]"
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    tags={project.tags}
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

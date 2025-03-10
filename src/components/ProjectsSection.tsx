"use client";
import { useTranslations } from "next-intl";
import ProjectCard from "./ProjectCard";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsSection() {
  const t = useTranslations();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const projects = t.raw("projects.items");

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("projects.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("projects.description")}
          </p>
        </div>

        <div
          className={`
          grid gap-6
          ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          }
        `}
        >
          {projects.map((project: any) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              tags={project.tags}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

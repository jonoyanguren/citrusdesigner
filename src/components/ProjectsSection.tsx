"use client";
import { useTranslations } from "next-intl";
import ProjectCard from "./ProjectCard";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export default function ProjectsSection() {
  const t = useTranslations();

  const projects = t.raw("projects.items") as Project[];

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-xl font-medium mb-8">{t("projects.tag")}</h3>
          <h2 className="text-3xl font-bold mb-4">
            {t("projects.title")}{" "}
            <span className="font-thin italic">{t("projects.titleThin")}</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t("projects.description")}
          </p>
        </div>

        <div className="relative mt-16">
          <div className="bg-yellow-300 h-[452px] w-4/5 rounded-xl absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-0"></div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
            {projects.map((project: Project) => (
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
      </div>
    </section>
  );
}

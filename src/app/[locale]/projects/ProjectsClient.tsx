"use client";

import { useTranslations } from "next-intl";
import Title from "@/components/Title";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  translations: {
    title: string;
    description: string;
  };
};

type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
};

export function ProjectsClient({ translations }: Props) {
  const t = useTranslations("projects");
  const projects = t.raw("items") as Project[];

  return (
    <div className="min-h-screen flex flex-col items-center py-16">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <Title
          title={translations.title}
          description={translations.description}
          highlightIndexes={[3, 4]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-16">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
            >
              <div className="relative h-[400px] w-full overflow-hidden">
                <Image
                  src={`/projects/${project.slug}/${project.heroImage}`}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Project info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-200">{project.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
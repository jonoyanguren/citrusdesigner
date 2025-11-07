import { setRequestLocale } from "next-intl/server";
import { ProjectTemplate } from "./ProjectTemplate";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const projectsDir = path.join(process.cwd(), "public/projects");

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const folders = fs.readdirSync(projectsDir, { withFileTypes: true });
  const slugs = folders
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const params = [];
  for (const slug of slugs) {
    params.push({ locale: "en", slug });
    params.push({ locale: "es", slug });
  }

  return params;
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Load project data from /public/projects/[slug]/data.json
  const projectPath = path.join(
    process.cwd(),
    "public/projects",
    slug,
    "data.json"
  );

  if (!fs.existsSync(projectPath)) {
    notFound();
  }

  const projectData = JSON.parse(fs.readFileSync(projectPath, "utf-8"));

  return <ProjectTemplate project={projectData} locale={locale} slug={slug} />;
}
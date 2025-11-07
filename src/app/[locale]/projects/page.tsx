import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectsClient } from "./ProjectsClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "projects" });

  const translations = {
    title: t("title"),
    description: t("description"),
  };

  return <ProjectsClient translations={translations} />;
}
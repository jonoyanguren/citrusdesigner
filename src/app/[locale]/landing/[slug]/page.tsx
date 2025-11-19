import { LandingPageTemplate } from "@/components/LandingPageTemplate";
import { LandingPageData, Locale } from "@/types/landing";
import fs from "fs";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import path from "path";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const landingsDir = path.join(process.cwd(), "public/landings");

  if (!fs.existsSync(landingsDir)) {
    return [];
  }

  const folders = fs.readdirSync(landingsDir, { withFileTypes: true });
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const landingPath = path.join(
    process.cwd(),
    "public/landings",
    slug,
    "data.json"
  );

  if (!fs.existsSync(landingPath)) {
    return {
      title: "Landing Page",
    };
  }

  const landingData: LandingPageData = JSON.parse(
    fs.readFileSync(landingPath, "utf-8")
  );

  const lang = locale as Locale;

  return {
    title: landingData.meta.title[lang],
    description: landingData.meta.description[lang],
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Load landing page data from /public/landings/[slug]/data.json
  const landingPath = path.join(
    process.cwd(),
    "public/landings",
    slug,
    "data.json"
  );

  if (!fs.existsSync(landingPath)) {
    notFound();
  }

  const landingData: LandingPageData = JSON.parse(
    fs.readFileSync(landingPath, "utf-8")
  );

  return (
    <LandingPageTemplate landingData={landingData} locale={locale as Locale} />
  );
}

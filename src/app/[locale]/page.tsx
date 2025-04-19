import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeClient } from "./HomeClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  await setRequestLocale(locale);
  const t = await getTranslations("home");

  const translations = {
    howItWorks: {
      title: t("howItWorks.title"),
      description: t("howItWorks.description"),
    },
    pricing: {
      title: t("pricing.title"),
      description: t("pricing.description"),
    },
    orangeMessage: t("orangeMessage"),
  };

  return <HomeClient translations={translations} />;
}

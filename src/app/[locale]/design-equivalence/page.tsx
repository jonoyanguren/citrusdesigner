import { getTranslations, setRequestLocale } from "next-intl/server";
import { DesignEquivalenceClient } from "./DesignEquivalenceClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function DesignEquivalencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "designEquivalence" });

  const translations = {
    title: t("title"),
    description: t("description"),
    callToAction: t("callToAction"),
    contactButton: t("contactButton"),
    categories: t.raw("categories"),
  };

  return <DesignEquivalenceClient translations={translations} />;
}

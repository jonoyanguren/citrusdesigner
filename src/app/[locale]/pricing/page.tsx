import { getTranslations, setRequestLocale } from "next-intl/server";
import { PricingClient } from "./PricingClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pricing" });

  const translations = {
    title: t("title"),
    description: t("description"),
  };

  return <PricingClient translations={translations} />;
}

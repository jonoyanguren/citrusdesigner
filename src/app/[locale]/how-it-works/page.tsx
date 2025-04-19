import { getTranslations, setRequestLocale } from "next-intl/server";
import { HowItWorksClient } from "./HowItWorksClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "howItWorks" });

  const translations = {
    title: t("title"),
    description: t("description"),
    limeMessage: t("limeMessage"),
    beforeAndAfterTitle: t("beforeAndAfter.title"),
    before: t("before"),
    after: t("after"),
    orangeMessage: t("orangeMessage"),
  };

  return <HowItWorksClient translations={translations} />;
}

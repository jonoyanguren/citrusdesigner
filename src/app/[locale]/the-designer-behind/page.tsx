import { getTranslations, setRequestLocale } from "next-intl/server";
import { TheDesignerBehindClient } from "./TheDesignerBehindClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function TheDesignerBehindPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "designerBehind" });

  const translations = {
    orangeMessage: t("orangeMessage"),
  };

  return <TheDesignerBehindClient translations={translations} />;
}

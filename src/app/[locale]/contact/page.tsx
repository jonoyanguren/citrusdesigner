import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactClient } from "./ContactClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });

  const translations = {
    title: t("title"),
    description: t("description"),
    email: {
      title: t("email.title"),
      description: t("email.description"),
      button: t("email.button"),
    },
    chat: {
      title: t("chat.title"),
      description: t("chat.description"),
      button: t("chat.button"),
    },
    meeting: {
      title: t("meeting.title"),
      description: t("meeting.description"),
      button: t("meeting.button"),
    },
  };

  return <ContactClient translations={translations} />;
}

import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { BlogClient } from "./BlogClient";

type Props = {
  params: {
    locale: string;
  };
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function BlogPage({ params }: Props) {
  await setRequestLocale(params.locale);
  const t = await getTranslations("blog");

  return <BlogClient translations={{ title: t("title") }} />;
}

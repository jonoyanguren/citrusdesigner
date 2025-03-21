"use client";
import { useTranslations } from "next-intl";
import Button from "./Button";
import DecorativeElements from "./DecorativeElements";
import { useParams, useRouter } from "next/navigation";

export default function Hero() {
  const t = useTranslations("home.hero");
  const router = useRouter();
  const { locale } = useParams();

  return (
    <section className="p-24 relative" suppressHydrationWarning>
      <DecorativeElements />
      <div className="max-w-3xl mx-auto bg-white">
        <h1 className="text-5xl leading-[64px] font-bold mb-6 text-center">
          {t("titleBegin")}{" "}
          <span className="bg-orange-400 text-white mx-2 px-2 font-['Caveat'] font-bold text-6xl leading-none rotate-[-2deg] inline-block rounded-sm">
            {t("titleMiddle")}
          </span>
          {t("titleEnd")}
        </h1>
        <p className="max-w-xl mx-auto text-xl text-gray-500 text-center mb-6">
          {t("description")}
        </p>
        <div className="flex justify-center gap-8">
          <Button onClick={() => router.push(`/${locale}/pricing`)}>
            {t("cta")}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/contact`)}
          >
            {t("ctaSecondary")}
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useTranslations } from "next-intl";
import Button from "./Button";
import DecorativeElements from "./DecorativeElements";
import MobileDecorativeElements from "./MobileDecorativeElements";
import { useParams, useRouter } from "next/navigation";

export default function Hero() {
  const t = useTranslations("home.hero");
  const router = useRouter();
  const { locale } = useParams();

  return (
    <div className="relative flex min-h-[75vh] md:min-h-0 items-center justify-center overflow-hidden">
      <DecorativeElements />
      <MobileDecorativeElements />
      <section className="p-6 md:p-24 relative" suppressHydrationWarning>
        <div className="w-full md:max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl md:leading-[64px] font-bold mb-6 text-center">
            {t("titleBegin")}{" "}
            <span className="bg-orange-400 text-white mx-2 px-2 font-['Caveat'] font-bold text-5xl mt-2 md:mt-0 md:text-6xl leading-none rotate-[-2deg] inline-block rounded-sm">
              {t("titleMiddle")}
            </span>
          </h1>
          <p className="max-w-xl mx-auto md:text-xl text-gray-500 text-center mb-6">
            {t("description")}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
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
    </div>
  );
}

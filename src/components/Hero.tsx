"use client";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";

interface HeroButton {
  text: string;
  variant?: "primary" | "secondary";
  href?: string;
}

interface HeroProps {
  namespace: string;
  showButtons?: boolean;
  buttons?: HeroButton[];
  className?: string;
}

export default function Hero({
  namespace,
  showButtons = true,
  buttons = [],
  className = "",
}: HeroProps) {
  const t = useTranslations(namespace);

  return (
    <section
      className={`flex flex-col gap-4 bg-green-50 w-full py-16 md:py-24 ${className}`}
    >
      <h1 className="text-4xl font-bold mb-6 text-center">{t("hero.title")}</h1>
      <p className="text-xl text-center mb-8">{t("hero.description")}</p>
      {showButtons && buttons.length > 0 && (
        <div className="flex gap-4 justify-center">
          {buttons.map((button, index) => (
            <Button key={index} variant={button.variant} href={button.href}>
              {t(button.text)}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}

"use client";
import { AboutTheDesigner } from "@/components/AboutTheDesigner";
import { OrangeMessage } from "@/components/OrangeMessage";
import { Principles } from "@/components/Principles";
import { useTranslations } from "next-intl";

export default function TheDesignerBehind() {
  const t = useTranslations("designerBehind");

  return (
    <section>
      <AboutTheDesigner />
      <OrangeMessage
        message={t("orangeMessage")}
        highlightIndexes={[15, 16, 17]}
      />
      <Principles />
    </section>
  );
}

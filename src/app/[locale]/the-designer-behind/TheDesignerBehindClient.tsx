"use client";

import { AboutTheDesigner } from "@/components/AboutTheDesigner";
import { OrangeMessage } from "@/components/OrangeMessage";
import { Principles } from "@/components/Principles";

type Props = {
  translations: {
    orangeMessage: string;
  };
};

export function TheDesignerBehindClient({ translations }: Props) {
  return (
    <section>
      <AboutTheDesigner />
      <OrangeMessage
        message={translations.orangeMessage}
        highlightIndexes={[15, 16, 17]}
      />
      <Principles />
    </section>
  );
}

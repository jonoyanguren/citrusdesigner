"use client";

import { usePathname } from "next/navigation";

const baseUrl = "https://citrusdesigner.com";
const supportedLocales = ["es", "en"];

export default function AlternateLinks() {
  const pathname = usePathname();

  return (
    <>
      {supportedLocales.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${baseUrl}/${lang}${pathname}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${pathname}`}
      />
    </>
  );
}

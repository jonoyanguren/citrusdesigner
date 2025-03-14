"use client";

import { ReactElement } from "react";
import Script from "next/script";

interface CalendlyWindow extends Window {
  Calendly?: {
    showPopupWidget: (url: string) => void;
  };
}

export default function CalendarButton() {
  const openCalendly = () => {
    const calendlyWindow = window as CalendlyWindow;
    if (calendlyWindow.Calendly) {
      calendlyWindow.Calendly.showPopupWidget(
        "https://calendly.com/acegarras/30min"
      );
    }
  };

  return {
    openCalendly,
    CalendlyScripts: (
      <>
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
      </>
    ),
  };
}

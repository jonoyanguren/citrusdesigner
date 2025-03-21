"use client";

import Script from "next/script";

interface CalendlyWindow extends Window {
  Calendly?: {
    showPopupWidget: (url: string) => void;
  };
}

export function useCalendly() {
  const openCalendly = () => {
    const calendlyWindow = window as CalendlyWindow;
    if (calendlyWindow.Calendly) {
      calendlyWindow.Calendly.showPopupWidget(
        "https://calendly.com/acegarras/30min"
      );
    }
  };

  return { openCalendly };
}

export default function CalendarButton() {
  const { openCalendly } = useCalendly();

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <button
        onClick={openCalendly}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Programar una llamada
      </button>
    </>
  );
}

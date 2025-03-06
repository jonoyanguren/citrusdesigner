"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function CalendarButton() {
  useEffect(() => {
    const initializeButton = () => {
      if ((window as any).Calendly) {
        (window as any).Calendly.initBadgeWidget({
          url: "https://calendly.com/acegarras/30min",
          text: "Agenda una reunión",
          color: "#0069ff",
          textColor: "#ffffff",
        });
      }
    };

    window.addEventListener("load", initializeButton);
    return () => window.removeEventListener("load", initializeButton);
  }, []);

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
    </>
  );
}

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (config: {
        url: string;
        text: string;
        color: string;
        textColor: string;
      }) => void;
    };
  }
}

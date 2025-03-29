"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { useTranslations } from "next-intl";

interface CalendlyApi {
  initPopupWidget: (options: { url: string }) => void;
}

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

export function useCalendly() {
  const [isCalendlyReady, setIsCalendlyReady] = useState(false);

  useEffect(() => {
    const loadCalendlyScript = () => {
      // Check if script is already loaded
      if (
        document.querySelector(
          'script[src="https://assets.calendly.com/assets/external/widget.js"]'
        )
      ) {
        setIsCalendlyReady(true);
        return;
      }

      // Load Calendly script
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => {
        console.log("Calendly script loaded successfully");
        setIsCalendlyReady(true);
      };
      script.onerror = (error) => {
        console.error("Error loading Calendly script:", error);
      };
      document.body.appendChild(script);

      // Load Calendly styles
      if (
        !document.querySelector(
          'link[href="https://assets.calendly.com/assets/external/widget.css"]'
        )
      ) {
        const link = document.createElement("link");
        link.href = "https://assets.calendly.com/assets/external/widget.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    };

    if (typeof window !== "undefined") {
      if (window.Calendly) {
        setIsCalendlyReady(true);
      } else {
        loadCalendlyScript();
      }
    }

    // No cleanup on unmount to keep the script loaded
    return () => {};
  }, []);

  const openCalendly = () => {
    try {
      if (typeof window === "undefined") {
        console.error("Window is not available");
        return;
      }

      if (!window.Calendly) {
        console.error("Calendly is not available");
        return;
      }

      // Add a small delay to ensure the widget is ready
      setTimeout(() => {
        if (window.Calendly) {
          window.Calendly.initPopupWidget({
            url: "https://calendly.com/acegarras/30min",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error opening Calendly:", error);
    }
  };

  return { openCalendly, isCalendlyReady };
}

export default function CalendarButton({
  variant = "primary",
}: {
  variant?: "primary" | "text";
}) {
  const t = useTranslations("calendar");
  const { openCalendly, isCalendlyReady } = useCalendly();

  return (
    <Button
      className="w-full"
      variant={variant}
      onClick={openCalendly}
      disabled={!isCalendlyReady}
    >
      {isCalendlyReady ? t("schedule_call") : t("loading")}
    </Button>
  );
}

"use client";

import { useEffect } from "react";
import Script from "next/script";

interface CalendarConfig {
  url: string;
  color: string;
  label: string;
  target: HTMLElement | null;
}

export default function CalendarButton() {
  useEffect(() => {
    const initializeButton = () => {
      if (window.calendar?.schedulingButton) {
        window.calendar.schedulingButton.load({
          url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ031JOAV5ygirtLHMtQWDm2C1ULlf3s_xZH29lzvZYHGaZQaamFerAo1CDJ9XC4aGRLNL-ERMY3",
          color: "#039BE5",
          label: "Reservar una cita",
          target: document.getElementById("calendar-button-container"),
        });
      }
    };

    // Solo intentar cuando la ventana se cargue completamente
    window.addEventListener("load", initializeButton);
    return () => window.removeEventListener("load", initializeButton);
  }, []);

  return (
    <>
      <Script
        src="https://calendar.google.com/calendar/scheduling-button-script.js"
        strategy="afterInteractive"
      />
      <link
        href="https://calendar.google.com/calendar/scheduling-button-script.css"
        rel="stylesheet"
      />
      <div
        id="calendar-button-container"
        className="flex justify-center min-h-[40px]"
      ></div>
    </>
  );
}

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: CalendarConfig) => void;
      };
    };
  }
}

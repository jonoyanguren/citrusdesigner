"use client";

import { useEffect, useState } from "react";

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
    // Cargar el script de Calendly
    const loadCalendlyScript = () => {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => {
        console.log("Script de Calendly cargado exitosamente");
        setIsCalendlyReady(true);
      };
      document.body.appendChild(script);

      // Cargar los estilos
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    };

    if (typeof window !== "undefined") {
      if (window.Calendly) {
        setIsCalendlyReady(true);
      } else {
        loadCalendlyScript();
      }
    }

    return () => {
      // Limpiar script y estilos al desmontar
      const script = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      const link = document.querySelector(
        'link[href="https://assets.calendly.com/assets/external/widget.css"]'
      );
      script?.remove();
      link?.remove();
    };
  }, []);

  const openCalendly = () => {
    try {
      console.log("Iniciando openCalendly...");

      if (typeof window === "undefined") {
        console.error("Window no está disponible");
        return;
      }

      if (!window.Calendly) {
        console.error("Calendly aún no está disponible");
        return;
      }

      console.log("Abriendo widget de Calendly...");
      window.Calendly.initPopupWidget({
        url: "https://calendly.com/acegarras/30min",
      });
      console.log("Widget de Calendly abierto exitosamente");
    } catch (error) {
      console.error("Error al abrir Calendly:", error);
    }
  };

  return { openCalendly, isCalendlyReady };
}

export default function CalendarButton() {
  const { openCalendly, isCalendlyReady } = useCalendly();

  return (
    <button
      onClick={openCalendly}
      disabled={!isCalendlyReady}
      className={`px-6 py-3 rounded-lg transition-colors ${
        isCalendlyReady
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {isCalendlyReady ? "Programar una llamada" : "Cargando..."}
    </button>
  );
}

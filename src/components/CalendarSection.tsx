import CalendarButton from "./CalendarButton";
import CalendlyWidget from "./CalendlyWidget";
import { useTranslations } from "next-intl";

export default function CalendarSection() {
  const t = useTranslations("aboutCitrus");

  return (
    <>
      {/* Calendario de Reservas - Versión iframe */}
      <div className="mt-12 w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("calendar.scheduleTitle")}
        </h2>
        <CalendlyWidget />
      </div>

      {/* Calendario de Reservas - Versión botón */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-6">
          {t("calendar.directScheduleTitle")}
        </h2>
        <CalendarButton />
      </div>
    </>
  );
}

"use client";

import Button from "./Button";
import { useTranslations } from "next-intl";
import { BOOKING_URL } from "@/lib/constants";

export function useCalendar() {
  const openCalendar = () => {
    if (typeof window !== "undefined") {
      window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
    }
  };

  return { openCalendar, isCalendarReady: true };
}

export default function CalendarButton({
  variant = "primary",
}: {
  variant?: "primary" | "text";
}) {
  const t = useTranslations("calendar");
  const { openCalendar } = useCalendar();

  return (
    <Button fullWidth variant={variant} onClick={openCalendar}>
      {t("schedule_call")}
    </Button>
  );
}

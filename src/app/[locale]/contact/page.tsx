"use client";

import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import { MdOutlineMail } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";

import Button from "@/components/Button";
import CalendarButton from "@/components/CalendarButton";

export default function Contact() {
  const t = useTranslations("contact");
  const { openCalendly, CalendlyScripts } = CalendarButton();

  const openWhatsApp = () => {
    const phoneNumber = "34620682321";
    const message = encodeURIComponent(
      "Hola, me gustaría más información sobre Citrus Designer"
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Title title={t("title")} description={t("description")} />
      {CalendlyScripts}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email Card */}
          <div className="bg-white border border-gray-300 rounded-lg p-8">
            <MdOutlineMail className="text-4xl mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-4">{t("email.title")}</h3>
            <p className="text-gray-600 mb-6">{t("email.description")}</p>
            <Button
              variant="outline"
              onClick={() => {
                window.open("mailto:contact@citrusdesigner.com", "_blank");
              }}
            >
              {t("email.button")}
            </Button>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white border border-gray-300 rounded-lg p-8">
            <FaWhatsapp className="text-4xl mb-4 text-[#25D366]" />
            <h3 className="text-2xl font-bold mb-4">{t("chat.title")}</h3>
            <p className="text-gray-600 mb-6">{t("chat.description")}</p>
            <Button variant="outline" onClick={openWhatsApp}>
              {t("chat.button")}
            </Button>
          </div>

          {/* Meeting Card */}
          <div className="bg-white border border-gray-300 rounded-lg p-8">
            <IoCalendarClearOutline className="text-4xl mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-4">{t("meeting.title")}</h3>
            <p className="text-gray-600 mb-6">{t("meeting.description")}</p>
            <Button variant="outline" onClick={openCalendly}>
              {t("meeting.button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

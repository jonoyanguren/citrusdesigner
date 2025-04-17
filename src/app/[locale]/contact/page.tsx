"use client";

import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Button from "@/components/Button";
import { useCalendly } from "@/components/CalendarButton";
import { RichText, RichTextHandle } from "@/components/RichText";
import { useRef, useState } from "react";

export default function Contact() {
  const t = useTranslations("contact");
  const { openCalendly } = useCalendly();
  const editorRef = useRef<RichTextHandle>(null);
  const [feedback, setFeedback] = useState("");

  const openWhatsApp = () => {
    const phoneNumber = "34620682321";
    const message = encodeURIComponent(
      "Hola, me gustaría más información sobre Citrus Designer"
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editorRef.current) {
      editorRef.current.clearContent();
    }
    console.log(feedback);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Title title={t("title")} description={t("description")} />

      <div className="container mx-auto px-4 py-12 relative mt-12">
        <div className="absolute -top-10 md:-top-20 -z-10 w-full">
          <BlobOrange />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email Card */}
          <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6">
            <Image src="/email.svg" alt="Email" width={60} height={60} />
            <h3 className="text-2xl font-bold">{t("email.title")}</h3>
            <p className="text-gray-600">{t("email.description")}</p>
            <Button
              variant="secondary"
              onClick={() => {
                window.open("mailto:contact@citrusdesigner.com", "_blank");
              }}
            >
              {t("email.button")}
            </Button>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6">
            <Image src="/chat.svg" alt="WhatsApp" width={60} height={60} />
            <h3 className="text-2xl font-bold">{t("chat.title")}</h3>
            <p className="text-gray-600">{t("chat.description")}</p>
            <Button variant="secondary" onClick={openWhatsApp}>
              {t("chat.button")}
            </Button>
          </div>

          {/* Meeting Card */}
          <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6">
            <Image src="/calendar.svg" alt="Calendar" width={60} height={60} />
            <h3 className="text-2xl font-bold">{t("meeting.title")}</h3>
            <p className="text-gray-600">{t("meeting.description")}</p>
            <Button variant="secondary" onClick={openCalendly}>
              {t("meeting.button")}
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="feedback">Feedback</label>
          <RichText
            ref={editorRef as React.RefObject<RichTextHandle>}
            initialContent=""
            onChange={(content) => setFeedback(content)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

const BlobOrange = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 1314 592"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
  >
    <path
      d="M140.239 394.328C163.963 428.916 194.453 452.407 229.767 474C336.368 539.181 388.229 539.377 471.664 489.288C529.005 454.865 658.407 457.28 717.22 477.875C763.595 494.116 826.49 592 875.4 592C905.313 592 924.817 584.619 951.8 572.62C988.908 556.119 990.013 514.101 983.866 478.737C974.375 424.13 946.961 362.147 967.295 305.181C978.161 274.739 1015.95 271.439 1042.83 278.911C1078.12 288.718 1112.78 320.238 1141.4 342.003C1172.59 365.721 1209.62 381.527 1249.01 367.196C1282.45 355.026 1314 341.482 1314 301.09C1314 262.187 1294.56 213.141 1271.39 182.013C1245.02 146.58 1221.36 106.436 1184.23 80.593C1149.47 56.4037 1112.02 46.1161 1062.2 38.1732C979.241 24.9462 931.779 52.7471 849.144 67.8885C715.526 92.3718 624.927 154.02 512.124 154.02C473.056 154.02 436.27 151.601 397.632 146.268C363.113 141.505 317.923 125.502 288.304 107.509C258.281 89.2705 224.554 72.5034 198.131 49.3703C157.4 13.7109 108.62 -9.40588 52.8636 3.72052C-22.0675 21.361 1.56696 94.1307 11.5431 154.02C18.519 195.899 40.6554 228.948 60.8264 266.207C84.4496 309.843 112.273 353.554 140.239 394.328Z"
      fill="#FDBA74"
    />
  </svg>
);

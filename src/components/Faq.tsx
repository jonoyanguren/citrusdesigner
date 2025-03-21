"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "./Button";
import Image from "next/image";
import { PiChatsCircle } from "react-icons/pi";
import { OrangeBlob } from "./OrangeBlob";

type FaqItem = {
  id: number;
  isOpen: boolean;
};

export default function Faq() {
  const t = useTranslations("pricing.faq");
  const [openFaqs, setOpenFaqs] = useState<FaqItem[]>([]);

  const toggleFaq = (id: number) => {
    if (openFaqs.find((faq) => faq.id === id)) {
      setOpenFaqs(openFaqs.filter((faq) => faq.id !== id));
    } else {
      setOpenFaqs([...openFaqs, { id, isOpen: true }]);
    }
  };

  const isFaqOpen = (id: number) => {
    return openFaqs.some((faq) => faq.id === id);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-16">
      <div className="mt-8 flex gap-8 relative">
        <div className="w-3/5">
          <h3 className="text-5xl font-semibold text-gray-900 mb-8">
            {t("title")}
          </h3>
          {/* FAQ Section - Left side (3/5) */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((id) => (
              <div
                key={id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(id)}
                >
                  <span className="font-medium text-gray-900">
                    {t(`questions.q${id}`)}
                  </span>
                  <span className="text-2xl text-gray-500">
                    {isFaqOpen(id) ? "-" : "+"}
                  </span>
                </button>
                {isFaqOpen(id) && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <p className="text-gray-600">{t(`answers.a${id}`)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Box - Right side (2/5) */}
        <div className="w-2/5 relative mt-16">
          <div className="bg-neutral-900 text-white border rounded-lg p-6 flex flex-col relative">
            <div className="absolute w-full h-full -z-10 -top-32 -left-10">
              <OrangeBlob />
            </div>
            <div className="flex items-start justify-between mb-8">
              <h3 className="text-2xl pr-20 font-semibold text-white">
                {t("infoBox.title")}
              </h3>
              <PiChatsCircle className="w-20 h-20 text-white" />
            </div>
            <p className="text-white mb-4 flex-grow">
              {t("infoBox.description")}
            </p>
            <Button variant="outline" className="mt-6">
              {t("infoBox.cta")}
            </Button>
            <Image
              className="absolute -bottom-20 -right-10 rotate-180"
              src="/halfOrange.svg"
              alt="halfOrange"
              width={150}
              height={150}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

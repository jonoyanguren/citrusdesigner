"use client";
import { useState } from "react";
import SectionTitle from "./SectionTitle";
import { useTranslations } from "next-intl";

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
    <div className="w-full max-w-4xl mx-auto px-4 mb-16">
      <SectionTitle
        title={t("title")}
        description={t("description")}
        descriptionThin={t("descriptionThin")}
        secondaryText={t("secondaryText")}
      />

      <div className="mt-8 space-y-4">
        {[1, 2, 3, 4, 5].map((id) => (
          <div
            key={id}
            className="border border-gray-200 rounded-lg overflow-hidden"
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
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-600">{t(`answers.a${id}`)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "./Button";
import Image from "next/image";
import { PiChatsCircle } from "react-icons/pi";
import { OrangeBlob } from "./OrangeBlob";
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from "react-icons/hi";
import { useParams } from "next/navigation";
type FaqItem = {
  id: number;
  title: string;
  answer: string;
  isOpen: boolean;
};

export default function Faq() {
  const t = useTranslations("pricing.faq");
  const { locale } = useParams();
  const [openFaqs, setOpenFaqs] = useState<FaqItem[]>([]);

  const faqs = t.raw("items") as FaqItem[];

  const toggleFaq = (id: number) => {
    if (openFaqs.find((faq) => faq.id === id)) {
      setOpenFaqs(openFaqs.filter((faq) => faq.id !== id));
    } else {
      setOpenFaqs([...openFaqs, faqs.find((f) => f.id === id)!]);
    }
  };

  const isFaqOpen = (id: number) => {
    return openFaqs.some((faq) => faq.id === id);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-16">
      <div className="mt-0 md:mt-8 flex flex-col md:flex-row gap-8 relative">
        <div className="w-full md:w-3/5">
          <h3 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-8">
            {t("title")}
          </h3>
          {/* FAQ Section - Left side (3/5) */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border-2 border-gray-900 rounded-lg overflow-hidden bg-white"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left transition-colors"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.title}
                  </span>
                  <span className="text-2xl text-gray-500">
                    {isFaqOpen(faq.id) ? (
                      <HiOutlineMinusCircle className="w-6 h-6" />
                    ) : (
                      <HiOutlinePlusCircle className="w-6 h-6" />
                    )}
                  </span>
                </button>
                {isFaqOpen(faq.id) && (
                  <div className="px-4 pb-4 bg-white">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Box - Right side (2/5) */}
        <div className="w-full md:w-2/5 relative mt-16">
          <div className="bg-neutral-900 text-white border rounded-lg p-6 flex flex-col relative">
            <div className="absolute w-full h-full -z-10 -top-16 md:-top-32 -left-10">
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
            <Button
              variant="outline"
              className="mt-6 text-center"
              href={`/contact`}
            >
              {t("infoBox.cta")}
            </Button>
            <Image
              className="hidden md:block absolute -bottom-20 -right-10 rotate-180"
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

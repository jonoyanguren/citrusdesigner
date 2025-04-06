"use client";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const languages = [
  { code: "es", name: "ES" },
  { code: "en", name: "EN" },
];

export default function LanguageSelector() {
  const { locale } = useParams();
  const router = useRouter();
  const t = useTranslations("navigation");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const availableLanguages = languages.filter((lang) => lang.code !== locale);

  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, right: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 16,
      right: window.innerWidth - rect.right,
    };
  };

  return (
    <div className="relative flex items-center" ref={selectorRef}>
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <button
          ref={buttonRef}
          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={t("selectLanguage")}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium">
            {languages.find((l) => l.code === locale)?.name}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <div className="border-l w-[1px] h-8 border-gray-300 ml-4" />
      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed w-24 bg-white rounded-md shadow-lg border border-gray-200 z-[9999]"
            style={getDropdownPosition()}
          >
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                {language.name}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

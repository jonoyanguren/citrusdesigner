"use client";

import { useTranslations } from "next-intl";
import Title from "@/components/Title";
import Image from "next/image";
import { Spacer } from "@/components/Spacer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface EquivalenceItem {
  title: string;
  description: string;
}

interface Category {
  name: string;
  description: string;
  items: EquivalenceItem[];
}

type Props = {
  translations: {
    title: string;
    description: string;
    callToAction: string;
    contactButton: string;
    categories: Category[];
  };
};

export function DesignEquivalenceClient({ translations }: Props) {
  const { locale } = useParams();
  const [openCategories, setOpenCategories] = useState<number[]>([0]);

  const toggleCategory = (index: number) => {
    setOpenCategories((prevOpen) =>
      prevOpen.includes(index)
        ? prevOpen.filter((i) => i !== index)
        : [...prevOpen, index]
    );
  };

  return (
    <div className="min-h-screen flex flex-col mt-12 items-center">
      <div className="relative max-w-4xl mx-auto px-4">
        <Image
          className="hidden md:block absolute -top-8 -left-6"
          src="/halfOrange.svg"
          alt="Design Equivalence"
          width={100}
          height={100}
        />
        <Title
          title={translations.title}
          description={translations.description}
          highlightIndexes={[1]}
        />
      </div>

      <Spacer space={8} />

      <div className="max-w-4xl mx-auto px-4 w-full">
        {translations.categories.map((category, catIndex) => (
          <div
            key={catIndex}
            className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            <div className="p-6 bg-orange-50 dark:bg-neutral-800">
              <button
                onClick={() => toggleCategory(catIndex)}
                className="w-full flex justify-between items-center dark:hover:bg-neutral-700 transition-colors text-left rounded-lg p-2"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h2>
                  {category.description && (
                    <div className="mt-3 text-gray-700 dark:text-gray-300">
                      <p>{category.description}</p>
                    </div>
                  )}
                </div>
                {openCategories.includes(catIndex) ? (
                  <FiChevronUp className="text-xl text-orange-500 flex-shrink-0" />
                ) : (
                  <FiChevronDown className="text-xl text-orange-500 flex-shrink-0" />
                )}
              </button>
            </div>

            {openCategories.includes(catIndex) && (
              <div className="p-6 space-y-4 bg-white dark:bg-neutral-900">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white dark:bg-neutral-800 rounded-lg p-2 flex flex-col"
                  >
                    <h3 className="text-xl font-bold mb-1 text-orange-400 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-200">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-16 text-center p-8 bg-orange-50 dark:bg-neutral-800 rounded-lg shadow-md">
          <p className="text-lg font-bold mb-6 dark:text-white">
            {translations.callToAction}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {translations.contactButton}
          </Link>
        </div>
      </div>

      <Spacer space={16} />
    </div>
  );
}

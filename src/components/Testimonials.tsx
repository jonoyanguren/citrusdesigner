import Image from "next/image";
import { FaQuoteRight } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Title from "./Title";

interface Testimonial {
  text: string;
  author: string;
  position: string;
  logo: string;
}

export const Testimonials = () => {
  const t = useTranslations("testimonials");
  const testimonials = t.raw("items") as Testimonial[];

  const quoteColors = ["text-orange-400", "text-yellow-400", "text-blue-400"];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
      <Title title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-start text-left"
          >
            <div className="w-40 h-24 relative">
              <Image
                src={`/testimonials/testimonial${index + 1}.png`}
                alt={`${testimonial.author}'s company logo`}
                fill
                className="object-contain"
              />
            </div>
            <FaQuoteRight className={`text-3xl ${quoteColors[index]} mb-4`} />
            <p className="text-gray-700 mb-6 italic text-sm">
              {testimonial.text}
            </p>
            <div>
              <p className="font-medium text-gray-900">{testimonial.author}</p>
              <p className="text-gray-500">{testimonial.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useTranslations } from "next-intl";
import Button from "./Button";
import Image from "next/image";

export default function BlogNotFound() {
  const t = useTranslations("blog");

  return (
    <div className="min-h-[70vh] flex items-center my-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-16">
            <Image
              src="/404-illustrarion.jpg"
              alt="Story not found"
              width={600}
              height={400}
              className="mx-auto rounded-2xl shadow-lg"
              priority
            />
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
              {t("notFound")}
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed font-serif max-w-xl mx-auto">
              {t("notFoundDescription")}
            </p>
            <Button
              href="/blog"
              variant="primary"
              className="text-lg px-8 py-3 rounded-full"
            >
              {t("backToBlog")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

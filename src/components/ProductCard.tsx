import { StripeProduct } from "@/lib/stripe";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

interface ProductCardProps {
  product: StripeProduct;
  isLoading: boolean;
  onSubscribe: (priceId: string, productName: string) => void;
}

export default function ProductCard({
  product,
  isLoading,
  onSubscribe,
}: ProductCardProps) {
  const t = useTranslations("pricing");
  const isHighlighted = product.name === "Pro";

  const highlightStyles = isHighlighted
    ? "border-4 border-neutral-900 bg-neutral-50"
    : "border-2 border-neutral-300 bg-white";
  return (
    <div
      className={`${highlightStyles} rounded-xl pt-8 pb-4 px-8 flex flex-col min-h-[700px] gap-6 text-lg relative shadow-xl`}
    >
      {isHighlighted && (
        <div className="absolute -right-[30px] -top-[15px] bg-yellow-300 rounded-full border border-neutral-900 text-black px-12 py-1 rotate-[10deg] text-sm font-medium">
          {t("badge.availableSpots")}
        </div>
      )}
      <h2 className="text-2xl font-bold text-center">{product.name}</h2>
      {product.price === 0 ? (
        <div className="text-center">
          <span className="text-4xl font-medium">{t("customPrice")}</span>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-4xl font-medium">${product.price}</span>
          <span className="text-lg text-neutral-500">/{t("month")}</span>
        </div>
      )}
      {product.description && (
        <p className="text-left">{product.description}</p>
      )}
      {product.price !== 0 && (
        <>
          {/* Features */}
          <div>
            <p className="font-bold underline mb-4 text-lg">
              {t(`features.title`)} {product.name}:
            </p>
            <ul className="space-y-4 mb-2 flex-grow">
              {t.raw(`features.${product.name}`).map((feature: string) => (
                <li key={feature} className="flex items-center text-lg">
                  <FaCheckCircle className="w-5 h-5 mr-3 text-neutral-900" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {/* Services */}
          <div>
            <p className="font-bold underline mb-4 text-lg">
              {t(`services.title`)}:
            </p>
            <ul className="space-y-4 mb-2 flex-grow">
              {t.raw(`services.${product.name}`).map((feature: string) => (
                <li key={feature} className="flex items-center text-lg">
                  <FaCheckCircle className="w-5 h-5 mr-3 text-neutral-900" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div className="mt-auto flex flex-col gap-4">
        <Button
          variant="secondary"
          fullWidth
          isLoading={isLoading}
          onClick={() => onSubscribe(product.priceId, product.name)}
        >
          {isLoading ? t("loading") : t("subscribe")}
        </Button>
        <Link
          href="/pricing"
          className="text-center text-lg text-medium text-neutral-900 underline"
        >
          {t("bookACall")}
        </Link>
      </div>
    </div>
  );
}

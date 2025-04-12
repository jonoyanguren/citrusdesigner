import { StripeProduct } from "@/lib/stripe";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import CalendarButton from "./CalendarButton";

interface ProductCardProps {
  product: StripeProduct;
  isLoading: boolean;
  onSubscribe: (priceId: string, productName: string) => void;
  showWaitlist: boolean;
}

export default function ProductCard({
  product,
  isLoading,
  onSubscribe,
  showWaitlist,
}: ProductCardProps) {
  const pricing = useTranslations("pricing");
  const t = useTranslations("subscriptions");
  const { locale } = useParams();

  const formatNumber = (num: number) => {
    const rounded = Math.round(num * 100) / 100;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  };

  const productKey = product.name.toLowerCase();
  const isHighlighted = product.name === "Pro";

  const highlightStyles = isHighlighted
    ? "border-4 border-neutral-900 bg-neutral-50"
    : "border-2 border-neutral-300 bg-white";

  return (
    <div
      className={`${highlightStyles} rounded-xl pt-8 pb-4 px-8 flex flex-col min-h-[700px] gap-6 text-lg relative shadow-xl`}
    >
      <h2 className="text-2xl font-bold text-center">
        {t(`products.${productKey}.name`)}
      </h2>
      {product.price === 0 ? (
        <div className="text-center">
          <span className="text-4xl font-medium">
            {t("common.customPrice")}
          </span>
          <div className="text-center">
            <span className="text-sm text-neutral-500">
              {pricing("customPriceDescription")}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-4xl font-medium">
            {formatNumber(product.price)} {pricing("currency")}
          </span>
          <span className="text-lg text-neutral-500">
            /
            {product.interval === "month"
              ? pricing("month")
              : pricing("2weeks")}{" "}
          </span>

          <div className="text-center">
            <span className="text-sm">
              {formatNumber(product.price * 1.21)} {pricing("currency")}
            </span>
            <span className="text-sm text-neutral-500">
              {" "}
              {pricing("taxIncluded")}
            </span>
          </div>
        </div>
      )}

      <p className="text-left">{t(`products.${productKey}.description`)}</p>
      <>
        {/* Features */}
        <div>
          <p className="font-bold underline mb-4 text-lg">
            {t("common.title")} {t(`products.${productKey}.name`)}:
          </p>
          <ul className="space-y-4 mb-2 flex-grow">
            {t.raw(`products.${productKey}.features`).map((feature: string) => (
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
            {t("common.services")}:
          </p>
          <ul className="space-y-4 mb-2 flex-grow">
            {t.raw(`products.${productKey}.services`).map((service: string) => (
              <li key={service} className="flex items-center text-lg">
                <FaCheckCircle className="w-5 h-5 mr-3 text-neutral-900" />
                {service}
              </li>
            ))}
          </ul>
        </div>
      </>
      {!showWaitlist ? (
        <div className="mt-auto flex flex-col gap-4">
          {product.id !== "custom" && (
            <Button
              variant="secondary"
              fullWidth
              isLoading={isLoading}
              onClick={() => onSubscribe(product.priceId, product.name)}
            >
              {isLoading ? pricing("loading") : pricing("subscribe")}
            </Button>
          )}
          <CalendarButton variant="text" />
        </div>
      ) : (
        <div className="mt-auto flex flex-col gap-4">
          <Button href={`/${locale}/waitlist`} className="text-center">
            {pricing("waitlistButton")}
          </Button>
        </div>
      )}
    </div>
  );
}

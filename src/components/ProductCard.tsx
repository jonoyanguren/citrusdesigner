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
  const t = useTranslations("pricing");
  const { locale } = useParams();
  const isHighlighted = product.name === "Pro";

  const highlightStyles = isHighlighted
    ? "border-4 border-neutral-900 bg-neutral-50"
    : "border-2 border-neutral-300 bg-white";
  return (
    <div
      className={`${highlightStyles} rounded-xl pt-8 pb-4 px-8 flex flex-col min-h-[700px] gap-6 text-lg relative shadow-xl`}
    >
      <h2 className="text-2xl font-bold text-center">{product.name}</h2>
      {product.price === 0 ? (
        <div className="text-center">
          <span className="text-4xl font-medium">{t("customPrice")}</span>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-4xl font-medium">
            {product.price.toLocaleString()} {t("currency")}
          </span>
          <span className="text-lg text-neutral-500">/{t("month")}</span>
        </div>
      )}
      {product.description && (
        <p className="text-left">{t(`descriptions.${product.name}`)}</p>
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
      {!showWaitlist ? (
        <div className="mt-auto flex flex-col gap-4">
          {product.id !== "enterprise" && (
            <Button
              variant="secondary"
              fullWidth
              isLoading={isLoading}
              onClick={() => onSubscribe(product.priceId, product.name)}
            >
              {isLoading ? t("loading") : t("subscribe")}
            </Button>
          )}
          <CalendarButton variant="text" />
        </div>
      ) : (
        <div className="mt-auto flex flex-col gap-4">
          <Button href={`/${locale}/waitlist`} className="text-center">
            {t("waitlistButton")}
          </Button>
        </div>
      )}
    </div>
  );
}

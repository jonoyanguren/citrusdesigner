"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeProduct } from "@/lib/stripe";
import LoadingPricing from "@/components/LoadingPricing";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { OrangeBlob } from "./OrangeBlob";
import { useTranslations } from "next-intl";
import WaitlistPage from "@/app/[locale]/waitlist/page";

type ProductsResponse = {
  waitlist: boolean;
  products?: StripeProduct[];
  message?: string;
  activeSubscriptions: number;
  maxProjects: number;
};

interface Benefit {
  title: string;
  description: string;
  icon: "sparkles" | "lightning" | "shield";
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const getProducts = async () => {
  const response = await fetch("/api/products");
  const data: ProductsResponse = await response.json();
  return data;
};

export default function PricingList() {
  const params = useParams();
  const t = useTranslations("pricing");
  const locale = (params.locale as string) || "es";
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response.waitlist) {
          setShowWaitlist(true);
        } else {
          setProducts(response.products || []);
        }
      } catch (err) {
        setError("Error cargando los planes");
        console.error("Error:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubscribe = async (priceId: string, productName: string) => {
    if (!priceId) {
      console.error(`No price ID found for product ${productName}`);
      return;
    }

    try {
      setIsLoading(productName);
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, locale }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error creating checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe not loaded");

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al procesar el pago");
    } finally {
      setIsLoading(null);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoadingProducts) {
    return <LoadingPricing />;
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 -z-10 w-full scale-x-[-1]">
        <OrangeBlob />
      </div>
      {showWaitlist ? (
        <div className="bg-white p-8 rounded-lg max-w-7xl mx-auto">
          <WaitlistPage />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products
            .sort((a, b) => a.price - b.price)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLoading={isLoading === product.name}
                onSubscribe={handleSubscribe}
                showWaitlist={showWaitlist}
              />
            ))}
          <ProductCard
            key="custom"
            product={{
              id: "enterprise",
              name: "Enterprise",
              price: 0,
              description: t("customPriceDescription"),
              priceId: "custom",
              features: [],
              interval: "month",
            }}
            isLoading={false}
            onSubscribe={handleSubscribe}
            showWaitlist={showWaitlist}
          />
        </div>
      )}
      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8 md:mt-20">
        {t.raw("benefits.items").map((benefit: Benefit, index: number) => (
          <div
            key={index}
            className={`bg-white p-8 rounded-lg border border-gray-300`}
          >
            <div
              className={`w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4`}
            >
              {benefit.icon === "sparkles" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-orange-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              )}
              {benefit.icon === "lightning" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-orange-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              )}
              {benefit.icon === "shield" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-orange-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

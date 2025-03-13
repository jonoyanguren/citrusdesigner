"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeProduct } from "@/lib/stripe";
import WaitlistMessage from "@/components/WaitlistMessage";
import LoadingPricing from "@/components/LoadingPricing";
import { useParams } from "next/navigation";
import ProductCard from "./ProductCard";

import { useTranslations } from "next-intl";
type ProductsResponse = {
  waitlist: boolean;
  products?: StripeProduct[];
  message?: string;
  activeSubscriptions: number;
  maxProjects: number;
};

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

  if (showWaitlist) {
    return <WaitlistMessage />;
  }

  if (isLoadingProducts) {
    return <LoadingPricing />;
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {products
        .sort((a, b) => a.price - b.price)
        .map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isLoading={isLoading === product.name}
            onSubscribe={handleSubscribe}
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
      />
    </div>
  );
}

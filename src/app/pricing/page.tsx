"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeProduct } from "@/lib/stripe";
import Button from "@/components/Button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Pricing() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Error fetching products");
        }
        const data = await response.json();
        setProducts(data);
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
        body: JSON.stringify({ priceId }),
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

  if (isLoadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando planes disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <main className="max-w-6xl w-full mt-16">
        <h1 className="text-4xl font-bold text-center mb-4">
          Planes y Precios
        </h1>
        <p className="text-xl text-center text-foreground/60 mb-12">
          Elige el plan que mejor se adapte a tus necesidades
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-foreground/20 rounded-xl p-8 flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              {product.description && (
                <p className="text-foreground/60 mb-4">{product.description}</p>
              )}
              <div className="mb-6">
                <span className="text-4xl font-bold">${product.price}</span>
                <span className="text-foreground/60">/{product.interval}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                fullWidth
                isLoading={isLoading === product.name}
                onClick={() => handleSubscribe(product.priceId, product.name)}
              >
                {isLoading === product.name ? "Procesando..." : "Suscribirse"}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

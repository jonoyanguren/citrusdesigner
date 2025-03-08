"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeProduct } from "@/lib/stripe";
import Button from "@/components/Button";

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

export default function Pricing() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response.waitlist) {
          setShowWaitlist(true);
          setWaitlistMessage(response.message || "");
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

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error submitting to waitlist");
      }

      setSubmitSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Error al añadir a la lista de espera. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
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

  if (showWaitlist) {
    return (
      <div className="min-h-screen flex flex-col items-center p-8">
        <main className="max-w-lg w-full mt-16">
          <h1 className="text-4xl font-bold text-center mb-4">
            Lista de Espera
          </h1>
          <p className="text-xl text-center text-foreground/60 mb-8">
            {waitlistMessage}
          </p>
          {submitSuccess ? (
            <div className="text-center p-4 bg-green-100 rounded-md">
              <p className="text-green-800">
                ¡Gracias por unirte a nuestra lista de espera! Te contactaremos
                pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <Button type="submit" fullWidth isLoading={isSubmitting}>
                {isSubmitting ? "Procesando..." : "Unirme a la lista de espera"}
              </Button>
            </form>
          )}
        </main>
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

"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface CheckoutSession {
  customer: {
    email: string;
    name: string;
  };
  subscription: {
    plan: {
      product: {
        name: string;
      };
    };
  };
}

function SuccessPage() {
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError("No se encontró el ID de la sesión");
      setIsLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/checkout-session/${sessionId}`);
        if (!response.ok) {
          throw new Error("Error al verificar el pago");
        }
        const data = await response.json();
        setSession(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al verificar el pago"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Verificando tu suscripción...
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">
            {error || "Error al procesar el pago"}
          </h2>
          <p className="mb-8">
            Por favor, contacta con soporte si el problema persiste.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
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
          <h1 className="text-3xl font-bold mb-2">¡Pago completado!</h1>
          <p className="text-foreground/60 mb-6">
            Gracias por suscribirte a {session.subscription.plan.product.name}
          </p>
        </div>

        <div className="bg-foreground/5 rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-4">Detalles de la suscripción</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-foreground/60">Email: </span>
              {session.customer.email}
            </p>
            <p>
              <span className="text-foreground/60">Plan: </span>
              {session.subscription.plan.product.name}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-foreground/60">
            Hemos enviado un email de confirmación a tu correo electrónico.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
            >
              Ir al inicio
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-foreground rounded-lg hover:bg-foreground/5 transition-colors"
            >
              Contactar soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;

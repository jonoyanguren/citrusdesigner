"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { IoMdCheckmark } from "react-icons/io";

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
  const t = useTranslations("success");
  const { locale } = useParams();

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
          <h2 className="text-2xl font-semibold mb-4">{t("verifying")}</h2>
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
            {t("error.title")}
          </h2>
          <p className="mb-8">{t("error.message")}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
          >
            {t("error.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full text-center">
        <div className="mb-8">
          <div className="bg-orange-400 w-fit rounded-full p-4 mx-auto mb-8">
            <IoMdCheckmark className="text-white mx-auto" size={100} />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("success.title")}</h1>
          <p className="mt-4 text-xl">
            {t("success.details.email")}{" "}
            <b className="font-bold">{session.customer.email}</b>
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <Button href="/">{t("success.actions.goHome")}</Button>
            <Button href={`/${locale}/contact`} variant="outline">
              {t("success.actions.contactSupport")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;

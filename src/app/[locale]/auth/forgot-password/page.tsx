"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const t = useTranslations("auth.forgotPassword");
  const { locale } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("errors.requestError"));
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.requestError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo2.png"
              alt="Citrus Logo"
              width={180}
              height={60}
              priority
            />
          </div>
          <h2 className="text-2xl font-bold mb-4">{t("errors.success")}</h2>
          <p className="text-foreground/60 mb-8">{t("description")}</p>
          <Link href="/auth/login" className="text-sm hover:underline">
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo2.png"
              alt="Citrus Logo"
              width={180}
              height={60}
              priority
            />
          </div>
          <h2 className="text-3xl font-bold">{t("title")}</h2>
          <p className="mt-2 text-foreground/60">{t("description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            id="email"
            type="email"
            label={t("email")}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? t("submitButtonLoading") : t("submitButton")}
          </Button>

          <p className="text-center text-sm">
            <Link href={`/auth/login`} className="hover:underline">
              {t("backToLogin")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("auth.resetPassword");
  const { locale } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!token) {
      setError(t("errors.invalidToken"));
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(t("errors.passwordTooShort"));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("errors.passwordsDontMatch"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.resetError"));
      }

      // Show success message before redirecting
      setError(t("errors.success"));
      setTimeout(() => {
        router.push(`${locale}/auth/login?reset=true`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.resetError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{t("title")}</h2>
          <p className="mt-2 text-foreground/60">{t("description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div
              className={`p-3 rounded-lg text-sm ${
                error.includes("exitosamente")
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              id="password"
              type="password"
              label={t("newPassword")}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              id="confirmPassword"
              type="password"
              label={t("confirmPassword")}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? t("submitButtonLoading") : t("submitButton")}
          </Button>

          <p className="text-center text-sm">
            <Link href="/auth/login" className="hover:underline">
              {t("backToLogin")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

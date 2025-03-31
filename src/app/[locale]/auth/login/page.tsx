"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("auth.login");
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.authFailed"));
      }

      setUser(data.user);

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.authFailed"));
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

          <Input
            id="password"
            type="password"
            label={t("password")}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 border-foreground/20 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm">
                {t("rememberMe")}
              </label>
            </div>

            <Link
              href="/auth/forgot-password"
              className="text-sm hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? t("submitButtonLoading") : t("submitButton")}
          </Button>

          <p className="text-center text-sm">
            {t("noAccount")}{" "}
            <Link href="/pricing" className="hover:underline">
              {t("register")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

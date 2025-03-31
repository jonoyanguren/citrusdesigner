"use client";
import { makeApiRequest } from "@/lib/api";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ChangePasswordFirstTime() {
  const router = useRouter();
  const t = useTranslations("changePassword");
  const { locale } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError(t("error"));
      return;
    }

    try {
      const response = await makeApiRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push(`/${locale}/dashboard`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 border bg-white p-8 rounded-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-foreground/60">{t("description")}</p>
          <Input
            id="password"
            name="password"
            type="password"
            label={t("newPassword")}
            required
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label={t("confirmPassword")}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button type="submit">{t("submitButton")}</Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}

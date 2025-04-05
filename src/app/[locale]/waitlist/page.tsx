"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Title from "@/components/Title";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
export default function WaitlistPage({
  type = "large",
}: {
  type?: "small" | "large";
}) {
  const t = useTranslations("waitlist");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Error al unirse a la lista de espera");
      }
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="px-24 w-full">
          <div className="relative">
            <Image
              className="absolute top-0 left-0"
              src="/orangeWithLines.png"
              alt="Waitlist"
              width={150}
              height={150}
            />
            <Title
              title={t("successTitle")}
              description={t("successDescription")}
            />
            <Image
              className="absolute bottom-0 right-0"
              src="/orangeWithLines1.png"
              alt="Waitlist"
              width={150}
              height={150}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-96 gap-8 p-6">
          <Button fullWidth href={"/"} className="text-center font-bold">
            {t("successButton")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {type === "large" && (
        <div className="px-24 w-full">
          <div className="relative">
            <Image
              className="absolute top-0 left-0"
              src="/orangeWithLines.png"
              alt="Waitlist"
              width={150}
              height={150}
            />
            <Title title={t("title")} description={t("description")} />
            <Image
              className="absolute bottom-0 right-0"
              src="/orangeWithLines1.png"
              alt="Waitlist"
              width={150}
              height={150}
            />
          </div>
        </div>
      )}
      {type === "small" && (
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-2xl font-bold text-neutral-900">
            {t("title")}
          </p>
          <p className="text-center text-lg mt-4 text-neutral-500">
            {t("description")}
          </p>
        </div>
      )}
      <div
        className={`flex items-center justify-center max-w-2xl w-full gap-8 p-6 ${
          type === "small" ? "flex-row w-fit mt-2" : "flex-col w-96"
        }`}
      >
        <Input
          type="email"
          value={email}
          placeholder={t("emailPlaceholder")}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button fullWidth onClick={handleSubmit}>
          {t("joinWaitlist")}
        </Button>
      </div>
    </div>
  );
}

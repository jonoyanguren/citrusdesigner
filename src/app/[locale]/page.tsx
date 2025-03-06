"use client";
import Button from "@/components/Button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Home() {
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">{t("welcome")}</h1>
        <p className="text-xl text-center mb-8">{t("platform")}</p>
        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            onClick={() => router.push("/how-it-works")}
          >
            {t("howItWorks")}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/contact")}>
            {t("contactUs")}
          </Button>
        </div>
      </main>
    </div>
  );
}

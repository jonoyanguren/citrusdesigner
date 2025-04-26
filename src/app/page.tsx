import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Citrus Designer - Transforma tus diseños en código",
  description:
    "Transforma tus diseños en código de forma automática con Citrus Designer",
  alternates: {
    languages: {
      es: "/es",
      en: "/en",
    },
  },
};

export default async function RootPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);

  // Si es un bot, mostrar contenido para SEO
  if (isBot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-4">Citrus Designer</h1>
          <p className="text-xl mb-4">
            Transforma tus diseños en código de forma automática
          </p>
          <div className="space-y-2">
            <p>Versiones disponibles:</p>
            <Link href="/es" className="block text-blue-600 hover:underline">
              Español
            </Link>
            <Link href="/en" className="block text-blue-600 hover:underline">
              English
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Para usuarios normales, redirigir al idioma por defecto
  redirect("/es");
}

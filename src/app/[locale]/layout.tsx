import type { Metadata } from "next";
import { Geist, Geist_Mono, Patrick_Hand } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { LocaleType } from "@/types/locale";
import "@/app/globals.css";
import Script from "next/script";
import AlternateLinks from "@/components/AlternateLinks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "Citrus Designer - Diseño por suscripción | UI/UX y Branding",
  description:
    "Servicio de diseño por suscripción flexible. Diseño UI/UX, branding y desarrollo de identidad visual. Sin contratos, pausa o cancela cuando quieras.",
  keywords: [
    "diseño por suscripción",
    "diseño UI/UX",
    "branding",
    "diseño web",
    "diseñador freelance",
    "diseño flexible",
    "servicio de diseño mensual",
  ],
  authors: [{ name: "Andrea" }],
  openGraph: {
    title: "Citrus Designer - Diseño por suscripción | UI/UX y Branding",
    description:
      "Servicio de diseño por suscripción flexible. Diseño UI/UX, branding y desarrollo de identidad visual. Sin contratos, pausa o cancela cuando quieras.",
    url: "https://citrusdesigner.com",
    siteName: "Citrus Designer",
    images: [
      {
        url: "https://citrusdesigner.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Citrus Designer - Servicio de diseño por suscripción",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Citrus Designer - Diseño por suscripción | UI/UX y Branding",
    description:
      "Servicio de diseño por suscripción flexible. Diseño UI/UX, branding y desarrollo de identidad visual. Sin contratos, pausa o cancela cuando quieras.",
    images: ["https://citrusdesigner.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://citrusdesigner.com",
    languages: {
      es: "/es",
      en: "/en",
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: LocaleType };
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Citrus Designer",
    description:
      "Servicio de diseño por suscripción flexible. Diseño UI/UX, branding y desarrollo de identidad visual.",
    url: "https://citrusdesigner.com",
    logo: "https://citrusdesigner.com/logo.png",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ES",
    },
    sameAs: [
      "https://www.linkedin.com/company/citrusdesigner",
      "https://twitter.com/citrusdesigner",
      "https://www.instagram.com/citrusdesigner",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: "https://citrusdesigner.com/pricing",
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AlternateLinks />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${patrickHand.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

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
  title: "Citrus Designer",
  description: "Diseño de interfaces de usuario con IA",
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

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${patrickHand.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

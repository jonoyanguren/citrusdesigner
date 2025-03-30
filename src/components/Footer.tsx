"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
export default function Footer() {
  const t = useTranslations("footer");
  const { locale } = useParams();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-4">
              {t("company.title")}
            </h3>
            <p className="text-gray-400 mb-4">{t("company.description")}</p>
            <div className="flex space-x-4">
              <Link href="/" className="hover:text-white transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                LinkedIn
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Instagram
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {t("quickLinks.title")}
            </h3>
            <ul className="space-y-2">
              {t
                .raw("quickLinks.items")
                .map((item: { href: string; text: string }) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {t("contact.title")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t("contact.email")}</li>
              <li>{t("contact.phone")}</li>
              <li>{t("contact.address")}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              {t("copyright")} &copy; {new Date().getFullYear()}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href={`/${locale}/privacy`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("legal.privacy")}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("legal.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

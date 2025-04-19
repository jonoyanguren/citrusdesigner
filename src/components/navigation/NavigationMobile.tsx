"use client";
import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { createPortal } from "react-dom";
import CalendarButton from "../CalendarButton";
import Button from "../Button";
import { useParams } from "next/navigation";

export default function NavigationMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, setUser } = useAuth();
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const { locale } = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      setIsOpen(false);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        const baseUrl = window.location.origin;
        window.location.href = baseUrl;
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="lg:hidden bg-white">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 focus:outline-none border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          aria-label="Menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-full bg-gray-600 transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-gray-600 transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-gray-600 transition-transform duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu - Using Portal */}
      {isOpen &&
        mounted &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className={`fixed inset-0 bg-black/20 z-[9998] transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div
              className={`fixed top-[60px] right-0 w-full bg-white shadow-lg z-[9999] rounded-b-lg max-w-md mx-auto transition-all duration-300 ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
            >
              <div className="flex flex-col p-4">
                <Link
                  href="/"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("home")}
                </Link>
                <Link
                  href="/how-it-works"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("howItWorks")}
                </Link>
                <Link
                  href="/pricing"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("pricing")}
                </Link>
                <Link
                  href="/design-equivalence"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("designEquivalence")}
                </Link>
                <Link
                  href="/the-designer-behind"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("theDesignerBehind")}
                </Link>
                <Link
                  href="/contact"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("contact")}
                </Link>

                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="px-4 py-2">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        href={pathname}
                        locale="es"
                        className="hover:opacity-70 transition-opacity"
                        onClick={() => setIsOpen(false)}
                      >
                        ES
                      </Link>
                      <div className="h-4 w-[1px] bg-gray-300" />
                      <Link
                        href={pathname}
                        locale="en"
                        className="hover:opacity-70 transition-opacity"
                        onClick={() => setIsOpen(false)}
                      >
                        EN
                      </Link>
                      <div className="h-4 w-[1px] bg-gray-300" />
                    </div>
                  </div>
                  {user ? (
                    <>
                      <div className="text-sm text-gray-600 px-4 py-2">
                        {user.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-red-500 hover:bg-red-50 transition-colors py-3 px-4 rounded-lg"
                      >
                        {t("logout")}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 p-2">
                      <Button
                        variant="outline"
                        href={`/auth/login`}
                        className="text-center m-4"
                        onClick={() => setIsOpen(false)}
                      >
                        {t("login")}
                      </Button>
                      <div className="w-full px-4">
                        <CalendarButton />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}

"use client";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function NavigationMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth();
  const t = useTranslations("navigation");

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
    <div className="lg:hidden">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 w-full bg-white shadow-lg z-50 rounded-b-lg max-w-md mx-auto"
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
                  href="/our-story"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("ourStory")}
                </Link>
                <Link
                  href="/pricing"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("pricing")}
                </Link>
                <Link
                  href="/contact"
                  className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t("contact")}
                </Link>

                <div className="border-t border-gray-200 mt-2 pt-2">
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
                      <Link
                        href="/auth/login"
                        className="hover:bg-gray-50 transition-colors py-3 px-4 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        {t("login")}
                      </Link>
                      <Link
                        href="/auth/register"
                        className="bg-foreground text-background py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        {t("register")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

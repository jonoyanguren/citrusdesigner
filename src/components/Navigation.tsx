"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import AdminNavigation from "./navigation/AdminNavigation";
import UserNavigation from "./navigation/UserNavigation";
import NotificationsMenu from "./navigation/NotificationsMenu";
import NavigationMobile from "./navigation/NavigationMobile";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useAuth();
  const t = useTranslations("navigation");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
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
    <nav className="p-4 bg-background/80 backdrop-blur-sm border-b border-foreground/10 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Citrus Designer
        </Link>

        {/* Mobile Navigation */}
        <NavigationMobile />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 items-center">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            {t("home")}
          </Link>
          <Link
            href="/about-citrus"
            className="hover:opacity-70 transition-opacity"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href="/our-story"
            className="hover:opacity-70 transition-opacity"
          >
            {t("ourStory")}
          </Link>
          <Link href="/pricing" className="hover:opacity-70 transition-opacity">
            {t("pricing")}
          </Link>
          <Link href="/contact" className="hover:opacity-70 transition-opacity">
            {t("contact")}
          </Link>
          <div className="border-l border-foreground/10 mx-2" />
          {user ? (
            <div className="flex items-center gap-4">
              <NotificationsMenu />
              {user.role === "admin" ? (
                <AdminNavigation
                  user={user}
                  isMenuOpen={isMenuOpen}
                  setIsMenuOpen={setIsMenuOpen}
                  onLogout={handleLogout}
                />
              ) : (
                <UserNavigation
                  user={user}
                  isMenuOpen={isMenuOpen}
                  setIsMenuOpen={setIsMenuOpen}
                  onLogout={handleLogout}
                />
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hover:opacity-70 transition-opacity"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-1 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

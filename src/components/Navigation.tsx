"use client";
import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import AdminNavigation from "./navigation/AdminNavigation";
import UserNavigation from "./navigation/UserNavigation";
import NotificationsMenu from "./navigation/NotificationsMenu";
import NavigationMobile from "./navigation/NavigationMobile";
import LanguageSelector from "./navigation/LanguageSelector";
import Button from "./Button";
import CalendarButton from "./CalendarButton";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useAuth();
  const t = useTranslations("navigation");
  const { locale } = useParams();
  const router = useRouter();

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
        router.push(`/`);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="p-4 bg-background/80 backdrop-blur-sm border-b border-foreground/10 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          <Image
            src="/logo2.png"
            alt="Citrus Designer"
            width={150}
            height={150}
          />
        </Link>

        {/* Mobile Navigation */}
        <NavigationMobile />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-6 items-center">
          <Link
            href="/how-it-works"
            className="hover:opacity-70 transition-opacity"
          >
            {t("howItWorks")}
          </Link>
          <Link href="/pricing" className="hover:opacity-70 transition-opacity">
            {t("pricing")}
          </Link>
          <Link
            href="/design-equivalence"
            className="hover:opacity-70 transition-opacity"
          >
            {t("designEquivalence")}
          </Link>
          <Link
            href="/the-designer-behind"
            className="hover:opacity-70 transition-opacity"
          >
            {t("theDesignerBehind")}
          </Link>
          <Link href="/blog" className="hover:opacity-70 transition-opacity">
            {t("blog")}
          </Link>
          <Link href="/contact" className="hover:opacity-70 transition-opacity">
            {t("contact")}
          </Link>
          <div className="border-l w-[1px] h-8 border-gray-300" />
          <LanguageSelector />
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
            <div className="flex items-center gap-4 min-w-[300px]">
              <Button
                variant="outline"
                href={`/${locale}/auth/login`}
                fullWidth
              >
                {t("login")}
              </Button>
              <CalendarButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

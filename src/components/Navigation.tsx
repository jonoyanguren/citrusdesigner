"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminNavigation from "./navigation/AdminNavigation";
import UserNavigation from "./navigation/UserNavigation";
import NotificationsMenu from "./navigation/NotificationsMenu";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useAuth();

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
    <nav className="fixed top-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-b border-foreground/10 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Citrus Designer
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            Inicio
          </Link>
          <Link
            href="/how-it-works"
            className="hover:opacity-70 transition-opacity"
          >
            Cómo funciona
          </Link>
          <Link href="/pricing" className="hover:opacity-70 transition-opacity">
            Precios
          </Link>
          <Link href="/contact" className="hover:opacity-70 transition-opacity">
            Contacto
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
                Iniciar sesión
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-1 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

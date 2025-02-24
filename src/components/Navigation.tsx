"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuth();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById("user-menu");
      const button = document.getElementById("user-menu-button");
      if (
        menu &&
        !menu.contains(event.target as Node) &&
        !button?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setIsMenuOpen(false);
      router.push("/");
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
            <div className="relative">
              <Button
                id="user-menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <span>{user.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
              {isMenuOpen && (
                <div
                  id="user-menu"
                  className="absolute right-0 mt-2 w-48 py-2 bg-background rounded-lg shadow-lg"
                >
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="block px-4 py-2 hover:bg-foreground/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin/create-request"
                      className="block px-4 py-2 hover:bg-foreground/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Crear solicitud
                    </Link>
                  )}
                  <Button
                    variant="text"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500"
                  >
                    Cerrar sesión
                  </Button>
                </div>
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

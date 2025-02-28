"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();
  const { user, setUser } = useAuth();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById("user-menu");
      const button = document.getElementById("user-menu-button");
      const notificationsMenu = document.getElementById("notifications-menu");
      const notificationsButton = document.getElementById(
        "notifications-button"
      );

      if (
        menu &&
        !menu.contains(event.target as Node) &&
        !button?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }

      if (
        notificationsMenu &&
        !notificationsMenu.contains(event.target as Node) &&
        !notificationsButton?.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await fetch("/api/notifications");
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [user]);

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

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        setNotifications(notifications.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
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
              <div className="relative">
                <Button
                  id="notifications-button"
                  variant="text"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 hover:opacity-70 transition-opacity"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>
                {isNotificationsOpen && (
                  <div
                    id="notifications-menu"
                    className="absolute right-0 mt-2 w-80 py-2 bg-background rounded-lg shadow-lg"
                  >
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-foreground/5 border-b border-foreground/10 last:border-b-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-foreground/70">
                                {notification.message}
                              </p>
                              <span className="text-xs text-foreground/50">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <Button
                              variant="text"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-foreground/50 hover:text-foreground"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-foreground/50">
                        No hay notificaciones
                      </div>
                    )}
                  </div>
                )}
              </div>
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

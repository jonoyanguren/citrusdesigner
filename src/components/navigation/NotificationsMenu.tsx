import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import Button from "@/components/Button";
import { useTranslations } from "next-intl";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  action?: string;
}

export default function NotificationsMenu() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const t = useTranslations("common");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

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
    <div className="relative" ref={menuRef}>
      <Button
        id="notifications-button"
        variant="text"
        onClick={handleButtonClick}
        className="hover:opacity-70 transition-opacity p-2 border border-gray-300 rounded-full"
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
          <span className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>
      {isNotificationsOpen && (
        <div
          id="notifications-menu"
          onClick={handleMenuClick}
          className="absolute right-0 mt-2 w-80 py-2 bg-background rounded-lg shadow-lg"
        >
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-3 hover:bg-foreground/5 border-b border-foreground/10 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-foreground/70">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-foreground/50">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {notification.action && (
                        <Link
                          href={notification.action}
                          className="text-xs text-primary hover:underline ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsNotificationsOpen(false);
                          }}
                        >
                          {t("viewMore")}
                        </Link>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id);
                    }}
                    className="text-xs text-foreground/50 hover:text-foreground ml-2"
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
              {t("noNotifications")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

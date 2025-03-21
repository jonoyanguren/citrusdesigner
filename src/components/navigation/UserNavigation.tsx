import { useRouter } from "@/i18n/navigation";
import Button from "@/components/Button";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  user: User;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  onLogout: () => void;
};

export default function UserNavigation({
  user,
  isMenuOpen,
  setIsMenuOpen,
  onLogout,
}: Props) {
  const t = useTranslations("common");
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClick);
      // Calculate menu position
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 8,
          right: window.innerWidth - rect.right,
        });
      }
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDashboardClick = () => {
    setIsMenuOpen(false);
    router.push("/dashboard");
  };

  const menuContent = isMenuOpen && (
    <div
      id="user-menu"
      style={{
        position: "fixed",
        top: menuPosition.top,
        right: menuPosition.right,
      }}
      className="w-48 py-2 bg-background rounded-lg shadow-lg bg-white"
    >
      <button
        onClick={handleDashboardClick}
        className="block w-full text-left px-4 py-2 hover:bg-foreground/5"
      >
        {t("dashboard")}
      </button>
      <Button
        variant="text"
        onClick={(e) => {
          e.stopPropagation();
          onLogout();
        }}
        className="w-full text-left px-4 py-2 text-red-500"
      >
        {t("logout")}
      </Button>
    </div>
  );

  return (
    <div className="relative" ref={buttonRef}>
      <Button
        id="user-menu-button"
        variant="outline"
        onClick={handleButtonClick}
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
      {typeof document !== "undefined" &&
        createPortal(menuContent, document.body)}
    </div>
  );
}

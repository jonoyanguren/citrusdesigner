import { Link } from "@/i18n/navigation";
import Button from "@/components/Button";
import { User } from "@prisma/client";

type Props = {
  user: User;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  onLogout: () => void;
};

export default function AdminNavigation({
  user,
  isMenuOpen,
  setIsMenuOpen,
  onLogout,
}: Props) {
  return (
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
          className="absolute right-0 mt-2 w-48 py-2 bg-background rounded-lg shadow-lg z-10"
        >
          <Link
            href="/admin"
            className="block px-4 py-2 hover:bg-foreground/5"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/create-request"
            className="block px-4 py-2 hover:bg-foreground/5"
            onClick={() => setIsMenuOpen(false)}
          >
            Crear solicitud
          </Link>
          <Link
            href="/admin/waitlist"
            className="block px-4 py-2 hover:bg-foreground/5"
            onClick={() => setIsMenuOpen(false)}
          >
            Lista de espera
          </Link>
          <Button
            variant="text"
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-red-500"
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </div>
  );
}

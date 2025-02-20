import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "text";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-foreground text-background hover:opacity-90",
    secondary:
      "border border-foreground hover:bg-foreground hover:text-background transition-colors",
    danger: "bg-red-500 text-white hover:opacity-90",
    text: "text-foreground hover:opacity-90",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={twMerge(baseStyles, variants[variant], width, className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {typeof children === "string" ? "Cargando..." : children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}

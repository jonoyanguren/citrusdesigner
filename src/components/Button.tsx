import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text";
  fullWidth?: boolean;
  isLoading?: boolean;
  href?: string;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  href = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-800",
    secondary: "bg-black text-white",
    outline:
      "border border-gray-300 text-gray-900 hover:border-gray-900 bg-white",
    text: "text-gray-900 hover:text-gray-900 text-center",
  };

  const width = fullWidth ? "w-full" : "";

  const buttonClasses = twMerge(
    baseStyles,
    variants[variant],
    width,
    className
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
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

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex items-center justify-center mt-24 ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-foreground ${sizeClasses[size]}`}
        aria-label="Loading"
      />
    </div>
  );
}

export default LoadingSpinner;

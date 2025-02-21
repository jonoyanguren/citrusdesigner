"use client";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, fullWidth = false, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium mb-1 text-left">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            "px-3 py-2 border border-foreground/20 rounded-lg w-full",
            "focus:outline-none focus:ring-2 focus:ring-foreground/20",
            "bg-background disabled:opacity-50 disabled:cursor-not-allowed",
            "resize-y min-h-[100px]",
            fullWidth && "w-full",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;

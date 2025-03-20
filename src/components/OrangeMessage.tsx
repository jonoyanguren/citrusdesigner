import { ReactNode } from "react";

interface OrangeMessageProps {
  message: string;
  children?: ReactNode;
  className?: string;
}

export function OrangeMessage({
  message,
  children,
  className = "",
}: OrangeMessageProps) {
  return (
    <div
      className={`w-full relative px-6 bg-orange-400 py-20 overflow-hidden ${className}`}
    >
      {/* Pill-shaped confetti */}
      <div
        className="absolute left-8 top-6 w-6 h-3 rounded-full transform rotate-45"
        style={{ backgroundColor: "#D0ECFB" }}
      ></div>
      <div
        className="absolute left-20 bottom-10 w-8 h-4 rounded-full transform rotate-12"
        style={{ backgroundColor: "#FFCF0F" }}
      ></div>
      <div
        className="absolute -left-4 top-1/2 w-6 h-3 rounded-full transform -rotate-12"
        style={{ backgroundColor: "#5955FF" }}
      ></div>

      {/* Circular confetti */}
      <div
        className="absolute right-12 top-8 w-4 h-4 rounded-full"
        style={{ backgroundColor: "#FFCF0F" }}
      ></div>
      <div
        className="absolute right-24 bottom-12 w-5 h-5 rounded-full"
        style={{ backgroundColor: "#D0ECFB" }}
      ></div>
      <div
        className="absolute -right-2 top-1/3 w-3 h-3 rounded-full"
        style={{ backgroundColor: "#5955FF" }}
      ></div>

      {/* Additional mixed confetti */}
      <div
        className="absolute left-32 top-12 w-7 h-3 rounded-full transform rotate-[30deg]"
        style={{ backgroundColor: "#D0ECFB" }}
      ></div>
      <div
        className="absolute right-36 bottom-16 w-4 h-4 rounded-full"
        style={{ backgroundColor: "#FFCF0F" }}
      ></div>
      <div
        className="absolute left-16 bottom-20 w-6 h-3 rounded-full transform rotate-[15deg]"
        style={{ backgroundColor: "#5955FF" }}
      ></div>
      <div
        className="absolute right-20 top-24 w-3 h-3 rounded-full"
        style={{ backgroundColor: "#D0ECFB" }}
      ></div>

      {/* Small additional confetti */}
      <div
        className="absolute left-40 top-1/3 w-5 h-2.5 rounded-full transform rotate-[30deg]"
        style={{ backgroundColor: "#FFCF0F" }}
      ></div>
      <div
        className="absolute right-32 top-1/2 w-3 h-3 rounded-full"
        style={{ backgroundColor: "#5955FF" }}
      ></div>
      <div
        className="absolute left-1/4 bottom-16 w-4 h-2 rounded-full transform rotate-[15deg]"
        style={{ backgroundColor: "#D0ECFB" }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 text-white text-center max-w-4xl mx-auto text-3xl font-bold bg-orange-400 px-6">
        {message}
        {children}
      </div>
    </div>
  );
}

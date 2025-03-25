import { ReactNode } from "react";

interface OrangeMessageProps {
  message: string;
  children?: ReactNode;
  className?: string;
  highlightIndexes?: number[];
}

const confettiColors = ["#D0ECFB", "#FFCF0F", "#5955FF"];

const generateRandomConfetti = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    const isPill = Math.random() > 0.5;
    const color =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const rotation = Math.random() * 360;

    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;

    const width = isPill
      ? `${Math.random() * 18 + 8}px`
      : `${Math.random() * 16 + 7}px`;
    const height = isPill ? `${Math.random() * 4 + 2}px` : width;

    return (
      <div
        key={index}
        className={`absolute rounded-full transform`}
        style={{
          backgroundColor: color,
          left,
          top,
          width,
          height,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    );
  });
};

export function OrangeMessage({
  message,
  children,
  className = "",
  highlightIndexes = [],
}: OrangeMessageProps) {
  const words = message.split(" ");

  return (
    <div
      className={`w-full relative px-6 bg-orange-400 py-20 overflow-hidden col-span-2 ${className}`}
    >
      {generateRandomConfetti(20)}
      <div className="max-w-4xl mx-auto relative">
        {/* Main content */}
        <div className="relative z-10 text-center text-2xl md:text-3xl font-bold bg-orange-400 px-2 md:px-6">
          {words.map((word, index) => (
            <span key={index}>
              <span
                className={
                  highlightIndexes.includes(index)
                    ? "text-yellow-300"
                    : "text-white"
                }
              >
                {word}
              </span>{" "}
            </span>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
}

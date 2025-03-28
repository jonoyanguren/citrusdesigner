import { ReactNode } from "react";

interface LimeMessageProps {
  message: string;
  children?: ReactNode;
  className?: string;
  highlightIndexes?: number[];
}

export function LimeMessage({
  message,
  children,
  className = "",
  highlightIndexes = [],
}: LimeMessageProps) {
  const words = message.split(" ");

  return (
    <div
      className={`w-full relative px-6 bg-lime-50 rounded-lg py-20 overflow-hidden ${className}`}
    >
      {/* Decorative ring bubbles */}
      <div className="absolute left-8 top-6 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-orange-400"></div>
      <div className="absolute left-16 bottom-8 w-10 h-10 md:w-16 md:h-16 rounded-full border-2 md:border-4 border-orange-400"></div>
      <div className="absolute -left-4 top-1/2 w-6 h-6 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-orange-400"></div>

      <div className="absolute right-10 top-6 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-orange-400"></div>
      <div className="absolute right-12 bottom-10 w-12 h-12 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-orange-400"></div>
      <div className="absolute -right-2 top-1/3 w-8 h-8 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-orange-400"></div>

      {/* Main content */}
      <div className="relative z-10 text-gray-900 text-center max-w-4xl mx-auto text-2xl md:text-3xl font-regular">
        {words.map((word, index) => (
          <span key={index}>
            <span
              className={
                highlightIndexes.includes(index)
                  ? "bg-orange-400 text-white px-2"
                  : ""
              }
            >
              {word}
            </span>{" "}
          </span>
        ))}
        {children}
      </div>
      <div className="absolute bottom-4 right-4 w-24 h-24 md:w-40 md:h-40">
        {lime}
      </div>
    </div>
  );
}

const lime = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 199 200" fill="none">
    <path
      d="M99.0337 199.613C153.729 199.613 198.067 155.065 198.067 100.113C198.067 45.1607 153.729 0.613037 99.0337 0.613037C44.3389 0.613037 0 45.1607 0 100.113C0 155.065 44.3389 199.613 99.0337 199.613Z"
      fill="#FDE050"
    />
    <path
      d="M99.0353 190.192C148.528 190.192 188.65 149.862 188.65 100.113C188.65 50.3639 148.528 10.0343 99.0353 10.0343C49.5426 10.0343 9.4209 50.3639 9.4209 100.113C9.4209 149.862 49.5426 190.192 99.0353 190.192Z"
      fill="#FFF5E5"
    />
    <path
      d="M98.9665 88.4299L79.3765 41.0179C74.8536 30.0842 82.9005 18.0681 94.721 18.0681H106.07C117.89 18.0681 125.923 30.0842 121.414 41.0179L101.824 88.4299C101.297 89.7064 99.4798 89.7064 98.9526 88.4299H98.9665Z"
      fill="#FDE050"
    />
    <path
      d="M98.9665 110.492L79.3765 157.904C74.8536 168.838 82.9005 180.854 94.721 180.854H106.07C117.89 180.854 125.923 168.838 121.414 157.904L101.824 110.492C101.297 109.215 99.4798 109.215 98.9526 110.492H98.9665Z"
      fill="#FDE050"
    />
    <path
      d="M91.2706 93.106L43.9069 73.4308C32.9886 68.8936 30.1723 54.713 38.5379 46.36L46.5706 38.3262C54.9362 29.9594 69.1009 32.7761 73.6375 43.696L93.3099 91.0663C93.8371 92.3429 92.5608 93.6194 91.2845 93.0922L91.2706 93.106Z"
      fill="#FDE050"
    />
    <path
      d="M86.9842 101.417L39.5798 121.009C28.6478 125.533 16.6337 117.485 16.6337 105.663V94.3131C16.6337 82.4913 28.6478 74.4575 39.5798 78.967L86.9842 98.559C88.2606 99.0862 88.2606 100.904 86.9842 101.431V101.417Z"
      fill="#FDE050"
    />
    <path
      d="M93.0045 107.245L73.3321 154.615C68.7956 165.535 54.617 168.352 46.2652 159.985L38.2325 151.951C29.8669 143.584 32.6832 129.418 43.6016 124.881L90.9651 105.205C92.2415 104.678 93.5178 105.955 92.9907 107.231L93.0045 107.245Z"
      fill="#FDE050"
    />
    <path
      d="M107.787 93.106L155.15 73.4308C166.068 68.8936 168.885 54.713 160.519 46.36L152.487 38.3262C144.121 29.9594 129.956 32.7761 125.42 43.696L105.747 91.0663C105.22 92.3429 106.496 93.6194 107.773 93.0922L107.787 93.106Z"
      fill="#FDE050"
    />
    <path
      d="M112.088 101.417L159.493 121.009C170.425 125.533 182.439 117.485 182.439 105.663V94.3131C182.439 82.4913 170.425 74.4575 159.493 78.967L112.088 98.559C110.812 99.0862 110.812 100.904 112.088 101.431V101.417Z"
      fill="#FDE050"
    />
    <path
      d="M106.066 107.245L125.738 154.615C130.275 165.535 144.454 168.352 152.805 159.985L160.838 151.951C169.204 143.584 166.387 129.418 155.469 124.881L108.105 105.205C106.829 104.678 105.553 105.955 106.08 107.231L106.066 107.245Z"
      fill="#FDE050"
    />
    <path
      d="M102.823 96.1446C101.407 97.1437 98.4935 97.1437 97.0781 96.1446C96.9255 96.0336 96.7034 96.1446 96.7173 96.3528C96.8699 98.0733 95.4129 100.599 93.8449 101.334C93.6645 101.417 93.6645 101.667 93.8449 101.75C95.4129 102.486 96.8699 105.011 96.7173 106.732C96.7034 106.926 96.9116 107.051 97.0781 106.94C98.4935 105.941 101.407 105.941 102.823 106.94C102.975 107.051 103.198 106.94 103.184 106.732C103.031 105.011 104.488 102.486 106.056 101.75C106.236 101.667 106.236 101.417 106.056 101.334C104.488 100.599 103.031 98.0733 103.184 96.3528C103.198 96.1585 102.989 96.0336 102.823 96.1446Z"
      fill="#FDE3B7"
    />
  </svg>
);

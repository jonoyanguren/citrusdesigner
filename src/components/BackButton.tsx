"use client";

import { IoArrowBack } from "react-icons/io5";
import { useRouter, useParams } from "next/navigation";

interface BackButtonProps {
  text: string;
  url?: string;
}

export default function BackButton({ text, url }: BackButtonProps) {
  const router = useRouter();
  const { locale } = useParams();

  return (
    <button
      onClick={() => {
        if (url) {
          router.push(`/${locale}${url}`);
        } else {
          router.back();
        }
      }}
      className="flex items-center gap-2 mb-4 cursor-pointer"
    >
      <IoArrowBack className="text-2xl text-gray-900" />
      <p className="text-gray-900">{text}</p>
    </button>
  );
}

"use client";

import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  text: string;
}

export default function BackButton({ text }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 mb-4 cursor-pointer"
    >
      <IoArrowBack className="text-2xl text-gray-900" />
      <p className="text-gray-900">{text}</p>
    </button>
  );
}

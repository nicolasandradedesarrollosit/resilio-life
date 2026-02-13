"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const GoBack = ({ url }: { url: string }) => {
  const router = useRouter();

  return (
    <button
      className="absolute cursor-pointer top-6 left-6 flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group"
      onClick={() => {
        router.push(url);
      }}
    >
      <ArrowLeft
        className="text-gray-700 group-hover:text-black transition-colors"
        size={16}
      />
      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
        Volver
      </span>
    </button>
  );
};

"use client";

import { useRouter } from "next/navigation";

export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Kembali"
      className={`flex items-center justify-center w-11 h-11 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-xl text-white border border-white/20 shadow-2xl active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b50a] cursor-pointer ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

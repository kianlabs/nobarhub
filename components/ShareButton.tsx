"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text?: string;
  className?: string;
}

export function ShareButton({ title, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareText = text || `Tonton ${title} di NobarHub`;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Bagikan film ${title}`}
        className="w-full group relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1c1a17] hover:bg-[#252320] border border-[#33312c] hover:border-[#f5b50a]/70 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_15px_rgba(245,181,10,0.25)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b50a]"
      >
        {copied ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f5b50a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 animate-in zoom-in duration-200"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[#f5b50a]">Tautan disalin!</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-white group-hover:text-[#f5b50a] transition-colors"
              aria-hidden="true"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span className="group-hover:text-[#f5b50a] transition-colors">Bagikan</span>
          </>
        )}
      </button>

      {/* Floating Toast / Pesan Singkat Sementara */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1c1a17] text-[#f5b50a] text-xs font-bold rounded-full border border-[#f5b50a]/50 shadow-xl pointer-events-none whitespace-nowrap animate-bounce z-30"
        >
          Tautan disalin!
        </div>
      )}
    </div>
  );
}

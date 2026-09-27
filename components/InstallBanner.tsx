"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem("installBannerDismissed");
    
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      if (!isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("installBannerDismissed", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#f5b50a] text-[#121110] px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex-1 text-sm font-medium">
        Pasang NobarHub ke Layar Utama
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleInstallClick}
          className="bg-[#121110] text-[#f5b50a] px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-black transition-colors"
        >
          Pasang
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-[#d49b08] rounded-full transition-colors"
          aria-label="Tutup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

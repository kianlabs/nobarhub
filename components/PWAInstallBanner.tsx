"use client";

import { useState, useEffect } from "react";

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Cek apakah sudah standalone (sudah diinstall)
    const nav = window.navigator as NavigatorStandalone;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      nav.standalone === true;

    if (isStandalone) {
      return; // Sudah diinstall, jangan tampilkan banner
    }

    // Tampilkan banner secara asinkron agar tidak memicu synchronous setState di body effect
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 0);

    // Listen untuk beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback: tampilkan instruksi manual
      alert('Untuk memasang aplikasi:\n\niOS: Tap tombol Share, lalu "Add to Home Screen"\n\nAndroid: Tap menu (⋮), lalu "Install app" atau "Add to Home screen"');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("PWA installed");
      }

      // Tutup banner setelah user memilih
      setShowBanner(false);
      setDeferredPrompt(null);
    } catch (err) {
      console.error("Install error:", err);
    }
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-16 inset-x-0 z-[60] px-4 animate-[slideDown_0.3s_ease-out]">
      <div className="max-w-md mx-auto bg-[#f5b50a] rounded-xl shadow-lg flex items-center gap-2 px-3 py-2">
        <svg className="w-4 h-4 text-[#121110] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>

        <div className="flex-1 min-w-0">
          <p className="text-[#121110] font-bold text-xs leading-tight">
            Pasang NOBARHUB ke Layar Utama
          </p>
        </div>

        <button
          onClick={handleInstall}
          className="text-[#121110] font-black text-xs px-3 py-1.5 bg-white rounded-lg hover:bg-white/90 transition-colors flex-shrink-0"
        >
          Pasang
        </button>

        <button
          onClick={handleClose}
          className="text-[#121110] hover:text-[#121110]/70 transition-colors flex-shrink-0"
          aria-label="Tutup"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

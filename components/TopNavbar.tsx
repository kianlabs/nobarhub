"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNavbar({ className = "" }: { className?: string } = {}) {
  const pathname = usePathname();
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotification(false);
      }
    }
    if (showNotification) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotification]);

  return (
    <div className={`fixed top-0 inset-x-0 z-50 px-4 pt-3 transition-transform duration-300 ease-in-out ${className}`}>
      <nav className="max-w-7xl mx-auto bg-black/30 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="NobarHub Beranda"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16v12H4z" fill="#f5b50a"/>
              <path d="M2 8h20v8H2z" stroke="#f5b50a" strokeWidth="2"/>
              <circle cx="6" cy="12" r="1.5" fill="#121110"/>
              <circle cx="12" cy="12" r="1.5" fill="#121110"/>
              <circle cx="18" cy="12" r="1.5" fill="#121110"/>
            </svg>
            <span className="text-[#f5b50a] font-black tracking-tight text-base">NOBARHUB</span>
          </Link>
          {/* Right Icons */}
          <div className="flex items-center gap-3 relative" ref={notificationRef}>
            {pathname !== "/cari" && (
              <Link
                href="/cari"
                aria-label="Cari Film"
                className="text-[#f5b50a] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setShowNotification((prev) => !prev)}
              aria-label="Notifikasi"
              aria-expanded={showNotification}
              className="text-[#f5b50a] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 cursor-pointer relative flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>

            {/* Notification Popover */}
            {showNotification && (
              <div
                role="region"
                aria-label="Daftar Notifikasi"
                className="absolute right-0 top-12 w-64 bg-[#1c1a17] border border-[#33312c] rounded-xl shadow-2xl p-3 z-50 animate-[slideDown_0.2s_ease-out]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#33312c]">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Notifikasi</span>
                  <button
                    type="button"
                    onClick={() => setShowNotification(false)}
                    aria-label="Tutup notifikasi"
                    className="text-white/60 hover:text-white text-xs p-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="py-3 text-center">
                  <p className="text-xs text-[#fafafa] font-medium">Belum ada notifikasi baru</p>
                  <p className="text-[11px] text-[#a1a1aa] mt-1">Katalog film diperbarui secara berkala.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

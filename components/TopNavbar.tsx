"use client";

import Link from "next/link";

export function TopNavbar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 px-4 pt-3">
      <nav className="max-w-7xl mx-auto bg-black/30 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
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
          <div className="flex items-center gap-3">
            <Link href="/cari" className="text-[#f5b50a] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </Link>
            <button className="text-[#f5b50a] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

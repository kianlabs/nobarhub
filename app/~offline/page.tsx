"use client";

import Link from "next/link";
import { TopNavbar } from "@/components/TopNavbar";
import { BottomTabBar } from "@/components/BottomTabBar";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative">
      <TopNavbar />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f5b50a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-6"><path d="M2.66 2.66L21.34 21.34"/><path d="M10.58 10.58a2 2 0 0 0 2.84 2.84"/><path d="M16 16c1.1-1.1 2.2-2.2 3.3-3.3a8.5 8.5 0 0 0-11.2-11.2"/></svg>
        <h1 className="text-2xl font-black text-white mb-2">Anda Sedang Offline</h1>
        <p className="text-[#a1a1aa] mb-6 max-w-sm">
          Periksa koneksi internet Anda untuk kembali menjelajahi NobarHub. Beberapa halaman yang pernah Anda buka mungkin masih bisa diakses.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#f5b50a] text-[#121110] font-bold px-6 py-2.5 rounded-xl hover:bg-[#d49b08] active:scale-95 transition-all text-sm shadow-md"
          >
            Coba Lagi
          </button>
          <Link
            href="/watchlist"
            className="bg-[#1c1a17] text-white border border-[#33312c] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#262420] active:scale-95 transition-all text-sm"
          >
            Buka Watchlist Tersimpan
          </Link>
        </div>
      </div>
      <BottomTabBar />
    </div>
  );
}

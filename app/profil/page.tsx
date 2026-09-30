"use client";

import { TopNavbar } from "@/components/TopNavbar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { useWatchlistIds, clearWatchlistStorage } from "@/lib/watchlist";

export default function ProfilPage() {
  const watchlistIds = useWatchlistIds();
  const watchlistCount = watchlistIds.length;

  const handleClearWatchlist = () => {
    if (watchlistCount === 0) return;
    
    if (window.confirm("Yakin hapus semua watchlist?")) {
      clearWatchlistStorage();
      alert("Watchlist berhasil dihapus.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative shadow-2xl pb-28 md:pb-12 md:pt-20">
      <TopNavbar className="hidden md:block" />
      
      {/* Header Mobile Only */}
      <div className="sticky top-0 md:hidden z-30 bg-[#121110]/95 backdrop-blur-md px-4 py-3.5 border-b border-[#33312c]">
        <h1 className="text-xl font-black text-white tracking-tight">Profil</h1>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
        {/* Profil Section */}
        <section className="flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-[#f5b50a] flex items-center justify-center text-[#121110] text-3xl font-black shadow-lg">
            NH
          </div>
          <h2 className="text-2xl font-bold text-white">Pengguna NobarHub</h2>
        </section>

        <hr className="border-[#33312c] max-w-2xl mx-auto w-full" />

        {/* Statistik Section */}
        <section className="space-y-4 max-w-md mx-auto w-full">
          <h3 className="text-lg font-bold text-white">Statistik Anda</h3>
          <div className="bg-[#1c1a17] border border-[#33312c] rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#f5b50a]/20 p-2 rounded-lg text-[#f5b50a]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <p className="text-sm text-[#a1a1aa] font-medium">Film di Watchlist</p>
                <p className="text-xl font-black text-white">{watchlistCount}</p>
              </div>
            </div>
            {watchlistCount > 0 && (
              <button 
                onClick={handleClearWatchlist}
                className="text-sm font-semibold bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] px-3 py-2 rounded-lg transition-colors border border-[#ef4444]/20 w-full sm:w-auto"
              >
                Hapus Semua
              </button>
            )}
          </div>
        </section>

        {/* Tentang Section */}
        <section className="space-y-4 max-w-md mx-auto pt-4 w-full">
          <h3 className="text-lg font-bold text-white">Tentang NobarHub</h3>
          <div className="bg-[#1c1a17] border border-[#33312c] rounded-xl p-4 space-y-2">
            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Katalog film dengan trailer dari YouTube.
            </p>
            <p className="text-sm font-medium text-[#71717a]">
              Versi 0.1.0 (MVP)
            </p>
          </div>
        </section>
      </div>

      <BottomTabBar />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { Movie } from "@/types";
import { InteractiveMovieCard } from "@/components/InteractiveMovieCard";
import { TopNavbar } from "@/components/TopNavbar";
import { BottomTabBar } from "@/components/BottomTabBar";
import {
  toggleWatchlistStorage,
  getCachedWatchlistMovies,
  cacheWatchlistMovies,
} from "@/lib/watchlist";

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadWatchlist = async () => {
      const cached = getCachedWatchlistMovies();
      const saved = localStorage.getItem("nobarhub-watchlist");
      let ids: number[] = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) ids = parsed;
        } catch {
          // ignore
        }
      }

      if (ids.length === 0) {
        if (!isCancelled) {
          setMovies([]);
          setIsLoading(false);
        }
        return;
      }

      const validCached = cached.filter((m) => ids.includes(m.id));
      if (validCached.length > 0 && !isCancelled) {
        setMovies(validCached);
        setIsLoading(false);
      }

      const cachedIds = new Set(validCached.map((m) => m.id));
      const missingIds = ids.filter((id) => !cachedIds.has(id));

      if (missingIds.length === 0) {
        if (!isCancelled) setIsLoading(false);
        return;
      }

      try {
        const fetched = await Promise.all(
          missingIds.map(async (id) => {
            try {
              const res = await fetch(`/api/movies/${id}`);
              if (!res.ok) return null;
              return (await res.json()) as Movie;
            } catch {
              return null;
            }
          })
        );

        if (!isCancelled) {
          const validFetched = fetched.filter((m): m is Movie => m !== null);
          const combined = [...validCached, ...validFetched];
          setMovies(combined);
          cacheWatchlistMovies(combined);
        }
      } catch (error) {
        console.error("Gagal menyinkronkan watchlist:", error);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadWatchlist();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMovies((prev) => prev.filter((m) => m.id !== id));
    toggleWatchlistStorage(id);
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative shadow-2xl pb-28 md:pb-12 md:pt-20">
      <TopNavbar className="hidden md:block" />
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#121110]/95 md:bg-transparent backdrop-blur-md px-4 md:px-8 py-3.5 md:py-4 border-b border-[#33312c] md:border-none">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Watchlist Saya</h1>
          {movies.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f5b50a]/15 text-[#f5b50a] border border-[#f5b50a]/30">
              {movies.length} Film
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        {isLoading ? (
          <div className="text-center py-20 text-[#f5b50a]">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-sm">Memuat watchlist...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-24 px-4">
            <svg className="w-16 h-16 mx-auto text-[#33312c] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
            <p className="text-[#a1a1aa] leading-relaxed">
              Watchlist masih kosong — tambahkan film dari tombol Watchlist di beranda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-6">
            {movies.map(movie => (
              <InteractiveMovieCard 
                key={movie.id} 
                movie={movie} 
                actionButton={
                  <button 
                    onClick={(e) => { e.preventDefault(); handleRemove(e, movie.id); }}
                    className="bg-black/60 hover:bg-[#ef4444]/90 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors relative z-10"
                    aria-label={`Hapus ${movie.title} dari watchlist`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
      <BottomTabBar />
    </div>
  );
}

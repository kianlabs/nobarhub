"use client";

import { useState } from "react";
import type { Movie, Video } from "@/types";
import { TrailerModal } from "@/components/TrailerModal";
import { useIsInWatchlist, toggleWatchlistStorage } from "@/lib/watchlist";

export function HeroActions({ movie }: { movie: Movie }) {
  const isWatchlist = useIsInWatchlist(movie.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trailer, setTrailer] = useState<Video | null | undefined>(undefined);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const toggleWatchlist = () => {
    toggleWatchlistStorage(movie.id, movie);
  };

  const openTrailer = async () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    if (trailer === undefined) {
      setIsLoadingTrailer(true);
      try {
        const res = await fetch(`/api/movies/${movie.id}/videos`);
        if (res.ok) {
          const data = await res.json();
          setTrailer(data.video ?? null);
        } else {
          setTrailer(null);
        }
      } catch {
        setTrailer(null);
      } finally {
        setIsLoadingTrailer(false);
      }
    }
  };

  const closeTrailer = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <div className="flex items-center gap-3 pt-2">
        <button 
          onClick={openTrailer}
          className="flex-1 bg-[#f5b50a] hover:bg-[#d49b08] active:bg-[#b48307] text-[#121110] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
          Tonton Trailer
        </button>
        <button 
          onClick={toggleWatchlist}
          aria-label={isWatchlist ? "Hapus dari Watchlist" : "Tambah ke Watchlist"}
          className={`flex-1 border-2 font-bold py-[10px] rounded-lg flex items-center justify-center gap-2 transition-colors ${
            isWatchlist 
              ? "border-[#f5b50a] bg-[#f5b50a]/20 text-[#f5b50a]" 
              : "border-[#f5b50a] text-[#f5b50a] hover:bg-[#f5b50a]/10"
          }`}
        >
          {isWatchlist ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
              Di Watchlist
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Watchlist
            </>
          )}
        </button>
      </div>

      <TrailerModal 
        isOpen={isModalOpen}
        onClose={closeTrailer}
        title={movie.title}
        trailer={trailer}
        isLoading={isLoadingTrailer}
      />
    </>
  );
}

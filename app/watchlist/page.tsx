"use client";

import { useState, useEffect } from "react";
import { getMovieDetail, fetchVideos } from "@/lib/tmdb";
import type { Movie, Video } from "@/types";
import { InteractiveMovieCard } from "@/components/InteractiveMovieCard";
import { TopNavbar } from "@/components/TopNavbar";
import { BottomTabBar } from "@/components/BottomTabBar";

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWatchlist = async () => {
      const saved = localStorage.getItem("nobarhub-watchlist");
      if (!saved) {
        setIsLoading(false);
        return;
      }

      try {
        const ids: number[] = JSON.parse(saved);
        if (ids.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch all movies in parallel
        const results = await Promise.all(
          ids.map(id => getMovieDetail(id).catch(() => null))
        );
        // Filter out nulls
        setMovies(results.filter(Boolean) as Movie[]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent opening modal
    
    // Update state
    setMovies(prev => prev.filter(m => m.id !== id));
    
    // Update localStorage
    const saved = localStorage.getItem("nobarhub-watchlist");
    if (saved) {
      try {
        const ids: number[] = JSON.parse(saved);
        const newIds = ids.filter(i => i !== id);
        localStorage.setItem("nobarhub-watchlist", JSON.stringify(newIds));
      } catch (err) {}
    }
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative shadow-2xl pb-24 md:pb-0 md:pt-16">
      <TopNavbar />
      {/* Header */}
      <div className="sticky top-0 md:static z-30 bg-[#121110]/90 md:bg-transparent backdrop-blur-md px-4 md:px-8 py-4 border-b border-[#33312c] md:border-none">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-xl font-black text-white tracking-tight">Watchlist Saya</h1>
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
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6">
            {movies.map(movie => (
              <InteractiveMovieCard 
                key={movie.id} 
                movie={movie} 
                actionButton={
                  <button 
                    onClick={(e) => { e.preventDefault(); handleRemove(e, movie.id); }}
                    className="bg-black/60 hover:bg-[#ef4444]/90 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors relative z-10"
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

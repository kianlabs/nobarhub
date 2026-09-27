"use client";

import { useState, useEffect } from "react";
import { searchMovies, fetchVideos } from "@/lib/tmdb";
import type { Movie, Video } from "@/types";
import { InteractiveMovieCard } from "@/components/InteractiveMovieCard";
import { TopNavbar } from "@/components/TopNavbar";
import { BottomTabBar } from "@/components/BottomTabBar";

export default function CariPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Search logic
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const doSearch = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await searchMovies(debouncedQuery);
        setResults(data.results || []);
      } catch (err) {
        setError("Gagal memuat hasil pencarian.");
      } finally {
        setIsLoading(false);
      }
    };

    doSearch();
  }, [debouncedQuery]);


  return (
    <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative shadow-2xl pb-24 md:pb-0 md:pt-16">
      <TopNavbar />
      {/* Search Header */}
      <div className="sticky top-0 md:static z-30 bg-[#121110]/90 md:bg-transparent backdrop-blur-md px-4 md:px-8 py-4 border-b border-[#33312c] md:border-none">
        <div className="relative w-full max-w-7xl mx-auto">
          <input 
            type="text" 
            placeholder="Cari film..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#1c1a17] text-white border border-[#33312c] rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#f5b50a] transition-colors"
          />
          <svg className="absolute left-3.5 top-3.5 text-[#a1a1aa]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        {isLoading && (
          <div className="text-center py-10 text-[#f5b50a]">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-sm">Mencari...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-[#ef4444] text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && debouncedQuery && results.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-[#33312c] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3"/></svg>
            <p className="text-[#a1a1aa]">Tidak ada hasil untuk <br/><span className="text-white font-bold">"{debouncedQuery}"</span></p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6">
            {results.map(movie => (
              <InteractiveMovieCard 
                key={movie.id} 
                movie={movie} 
              />
            ))}
          </div>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}

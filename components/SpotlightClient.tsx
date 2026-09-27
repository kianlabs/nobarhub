"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types";
import { backdropUrl, posterUrl } from "@/lib/tmdb";

export function SpotlightClient({ movies }: { movies: Movie[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!movies || movies.length === 0) return null;

  // Auto scroll mobile item into view when active
  const handleSelect = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    setActiveIndex(idx);
    if (window.innerWidth < 768 && e.currentTarget) {
      setTimeout(() => {
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#121110]">
      {/* Background Images Layer */}
      {movies.map((movie, idx) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === activeIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <Image
            src={backdropUrl(movie.backdrop_path, "original")}
            alt={movie.title}
            fill
            priority={idx === 0}
            unoptimized
            className="object-cover"
          />
          {/* Complex gradients to ensure text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-[#121110]/90 to-transparent opacity-95 md:opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/40 to-transparent opacity-80" />
        </div>
      ))}

      {/* Main Content Layout */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24 pb-24 md:pb-8">
        
        {/* LEFT/TOP SIDE: Interactive Title List */}
        <div className="flex-1 flex flex-col justify-center w-full relative z-20">
          <div ref={containerRef} className="flex flex-col gap-4 md:gap-6 max-h-[70vh] md:max-h-[75vh] overflow-y-auto hide-scrollbar md:pr-4 pb-12">
            {movies.map((movie, idx) => {
              const isActive = idx === activeIndex;

              return (
                <div
                  key={movie.id}
                  onMouseEnter={() => window.innerWidth >= 768 && setActiveIndex(idx)}
                  onClick={(e) => handleSelect(idx, e)}
                  className="group cursor-pointer flex flex-col py-1 md:py-2"
                >
                  <h2
                    className={`text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight md:tracking-tighter transition-all duration-500 ease-out leading-[1.1] md:leading-none ${
                      isActive
                        ? "text-[#f5b50a] translate-x-2 md:translate-x-6 drop-shadow-2xl"
                        : "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] md:[-webkit-text-stroke:2px_rgba(255,255,255,0.2)] hover:[-webkit-text-stroke:1px_rgba(245,181,10,0.8)]"
                    }`}
                  >
                    {movie.title}
                  </h2>

                  {/* Mobile Only Details (Expanded when active) */}
                  <div
                    className={`md:hidden transition-all duration-700 ease-in-out overflow-hidden flex flex-col ${
                      isActive
                        ? "max-h-[800px] opacity-100 mt-4 translate-x-2"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <div className="flex gap-4 items-start mb-4">
                      {movie.poster_path && (
                        <div className="relative w-[100px] shrink-0 aspect-[2/3] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                          <Image
                            src={posterUrl(movie.poster_path, "w500")}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-2 flex-1 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 text-white font-bold text-xs bg-white/10 border border-white/20 px-2 py-1 rounded-md backdrop-blur-md">
                            <span className="text-[#f5b50a]">★</span> {movie.vote_average?.toFixed(1) || "N/A"}
                          </div>
                          <div className="text-white/60 text-xs font-medium">
                            {movie.release_date?.slice(0,4)}
                          </div>
                        </div>
                        <p className="text-[#d4d4d8] text-xs line-clamp-4 leading-relaxed">
                          {movie.overview || "Deskripsi tidak tersedia."}
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      href={`/film/${movie.id}`}
                      className="bg-[#f5b50a] text-[#121110] text-center py-3 rounded-full font-black text-sm hover:bg-white transition-all uppercase tracking-wider w-full shadow-lg"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: Fixed Poster Gallery (Desktop Only) */}
        <div className="hidden md:flex w-2/5 lg:w-1/3 flex-col justify-center items-end relative z-10 pl-8">
          <div className="relative w-full max-w-[320px] lg:max-w-[380px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10">
            {movies.map((movie, idx) => (
              <div 
                key={movie.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out origin-bottom ${
                  idx === activeIndex 
                    ? "opacity-100 scale-100 z-10 rotate-0 translate-y-0" 
                    : "opacity-0 scale-95 z-0 rotate-3 translate-y-8"
                }`}
              >
                <Image
                  src={posterUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-4">
                  <p className="text-[#d4d4d8] text-sm line-clamp-3 leading-relaxed drop-shadow-md">
                    {movie.overview || "Deskripsi tidak tersedia."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/film/${movie.id}`}
                      className="bg-[#f5b50a] text-[#121110] px-5 py-2.5 rounded-full font-black text-sm hover:bg-white hover:scale-105 transition-all uppercase tracking-wider flex-1 text-center"
                    >
                      Lihat Detail
                    </Link>
                    <div className="flex items-center justify-center text-white font-bold text-sm border border-white/20 px-3 py-2.5 rounded-full backdrop-blur-md bg-black/30">
                      ★ {movie.vote_average?.toFixed(1) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

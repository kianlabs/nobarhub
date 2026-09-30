"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MovieDetail, Video } from "@/types";
import { backdropUrl } from "@/lib/tmdb";
import { motion } from "framer-motion";
import { TrailerModal } from "@/components/TrailerModal";
import { useIsInWatchlist, toggleWatchlistStorage } from "@/lib/watchlist";

export function HeroSection({ movie }: { movie: MovieDetail }) {
  const isWatchlist = useIsInWatchlist(movie.id);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailer, setTrailer] = useState<Video | null | undefined>(undefined);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const toggleWatchlist = () => {
    toggleWatchlistStorage(movie.id, movie);
  };

  const openTrailer = async () => {
    setIsTrailerOpen(true);
    document.body.style.overflow = "hidden";
    if (trailer === undefined) {
      setIsLoadingTrailer(true);
      try {
        const res = await fetch(`/api/movies/${movie.id}/videos`);
        if (res.ok) {
          const data = await res.json();
          setTrailer(data.video || null);
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
    setIsTrailerOpen(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const runtimeText = movie.runtime ? `${Math.floor(movie.runtime / 60)} jam ${movie.runtime % 60} menit` : "";
  const genresText = movie.genres?.slice(0, 2).map(g => g.name).join(", ") || "";
  const voteCountText = movie.vote_count
    ? movie.vote_count >= 1000
      ? `${(movie.vote_count / 1000).toFixed(1)}rb ulasan`
      : `${movie.vote_count} ulasan`
    : "";
  const year = movie.release_date?.slice(0, 4) || "";
  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] min-h-[480px] md:min-h-[600px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src={backdropUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          unoptimized
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121110]/80 via-transparent to-[#121110]/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-4 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Title */}
          <motion.h1
            className="text-white font-black text-3xl sm:text-4xl md:text-6xl mb-2.5 md:mb-3 leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href={`/film/${movie.id}`} className="hover:text-[#f5b50a] transition-colors">
              {movie.title}
            </Link>
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            className="flex flex-wrap items-center gap-2 text-sm mb-5 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#f5b50a]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
            {voteCountText && (
              <>
                <span className="text-white/40">•</span>
                <span>{voteCountText}</span>
              </>
            )}
            {year && (
              <>
                <span className="text-white/40">•</span>
                <span>{year}</span>
              </>
            )}
            {runtimeText && (
              <>
                <span className="text-white/40">•</span>
                <span>{runtimeText}</span>
              </>
            )}
            {genresText && (
              <>
                <span className="text-white/40">•</span>
                <span>{genresText}</span>
              </>
            )}
            <span className="text-white/40">•</span>
            <span className="px-1.5 py-0.5 border border-white/40 rounded text-xs">13+</span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              type="button"
              onClick={openTrailer}
              aria-label="Tonton Trailer"
              className="flex-1 max-w-[200px] min-w-[140px] bg-[#f5b50a] text-[#121110] px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#d49b08] active:bg-[#b48307] transition-all cursor-pointer shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
              <span>Tonton Trailer</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={toggleWatchlist}
              aria-label={isWatchlist ? "Hapus dari Watchlist" : "Tambah ke Watchlist"}
              className={`px-6 py-3 border-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isWatchlist
                  ? "bg-[#f5b50a] border-[#f5b50a] text-[#121110] hover:bg-[#d49b08]"
                  : "border-white/40 text-white hover:bg-white/10 hover:border-white/60"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill={isWatchlist ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <span>{isWatchlist ? "Tersimpan" : "Watchlist"}</span>
            </motion.button>

            <Link
              href={`/film/${movie.id}`}
              aria-label={`Lihat detail film ${movie.title}`}
              className="px-4 py-3 rounded-lg text-white/80 hover:text-white font-medium text-sm flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
            >
              <span>Detail Film</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={closeTrailer}
        title={movie.title}
        trailer={trailer}
        isLoading={isLoadingTrailer}
      />
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { MovieDetail } from "@/types";
import { backdropUrl } from "@/lib/tmdb";
import { motion } from "framer-motion";

export function HeroSection({ movie }: { movie: MovieDetail }) {
  const ratingLabel = movie.vote_average >= 8 ? "Sangat Bagus" : movie.vote_average >= 6 ? "Bagus" : "Cukup";
  const runtimeText = movie.runtime ? `${Math.floor(movie.runtime / 60)} jam ${movie.runtime % 60} menit` : "";
  const genresText = movie.genres?.slice(0, 2).map(g => g.name).join(", ") || "";
  const voteCountText = movie.vote_average
    ? `${(movie.vote_average * 12.4).toFixed(0)}rb ulasan`
    : "";
  const year = movie.release_date?.slice(0, 4) || "";

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] max-h-[800px] overflow-hidden">
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
      <div className="relative z-10 h-full flex flex-col justify-end px-4 pb-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Title */}
          <motion.h1
            className="text-white font-black text-4xl md:text-6xl mb-3 leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {movie.title}
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
            className="flex gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href={`/film/${movie.id}`}
              className="flex-1 max-w-[200px] bg-[#f5b50a] text-[#121110] px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#ffd700] transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
              Tonton Trailer
            </Link>
            <motion.button
              className="px-6 py-3 border-2 border-white/40 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              Watchlist
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

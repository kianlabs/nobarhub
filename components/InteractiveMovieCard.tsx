"use client";

import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types";

interface InteractiveMovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  actionButton?: React.ReactNode;
}

export function InteractiveMovieCard({ movie, onClick, actionButton }: InteractiveMovieCardProps) {
  const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : "—";
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg";

  return (
    <div className="relative flex flex-col gap-2 group">
      <Link
        href={`/film/${movie.id}`}
        onClick={() => onClick?.(movie)}
        className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-[#1c1a17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b50a] transition-transform active:scale-95 group/link block"
      >
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover"
          loading="lazy"
        />
      </Link>
      
      <div>
        <h3 className="text-zinc-100 font-bold text-xs sm:text-sm line-clamp-1 group-hover/link:text-[#f5b50a] transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center text-[#a1a1aa] text-[11px] sm:text-xs mt-0.5">
          <span className="text-[#f5b50a] font-bold mr-1">★</span> {rating}
        </div>
      </div>
      
      {actionButton && <div className="absolute top-1 right-1">{actionButton}</div>}
    </div>
  );
}

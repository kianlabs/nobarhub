import Image from "next/image";
import Link from "next/link";
import { posterUrl } from "@/lib/tmdb";
import type { Movie } from "@/types";

interface HeroBannerProps {
  movie: Movie;
}

export function HeroBanner({ movie }: HeroBannerProps) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : "—";

  const backdrop = posterUrl(movie.backdrop_path, "w1280");

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden bg-zinc-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdrop}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.85]"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-2xl space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-red-950/30">
            <span>🔥</span>
            <span>Trending #1</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {movie.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-300">
            <span className="flex items-center gap-1 text-amber-400">
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{rating}</span>
            </span>
            <span>•</span>
            <span>{year}</span>
          </div>

          {/* Overview */}
          <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow">
            {movie.overview || "Deskripsi film belum tersedia."}
          </p>

          {/* CTA */}
          <div className="pt-2 flex items-center gap-4">
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-red-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Lihat Detail</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

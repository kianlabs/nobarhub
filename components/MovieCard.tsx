import Image from "next/image";
import Link from "next/link";
import { posterUrl } from "@/lib/tmdb";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : "—";

  const imageUrl = posterUrl(movie.poster_path, "w500");

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-zinc-950">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2">
        <h3 className="text-zinc-100 font-semibold text-base line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-zinc-400 text-xs sm:text-sm mt-auto pt-1">
          <span>{year}</span>
          <span className="bg-zinc-950/80 text-amber-400 font-medium px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{rating}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

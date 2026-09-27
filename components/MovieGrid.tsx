import { MovieCard } from "./MovieCard";
import type { Movie } from "@/types";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
}

export function MovieGrid({
  movies,
  title = "Trending Minggu Ini",
  subtitle = "Film-film yang sedang ramai ditonton.",
}: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

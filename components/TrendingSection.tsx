import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types";
import { posterUrl } from "@/lib/tmdb";
import { FadeIn } from "./FadeIn";

interface TrendingSectionProps {
  title?: string;
  movies: Movie[];
  delay?: number;
}

export function TrendingSection({
  title = "Trending Minggu Ini",
  movies,
  delay = 0.2,
}: TrendingSectionProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <FadeIn delay={delay}>
      <section className="w-full px-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-lg md:text-xl tracking-tight">
              {title}
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-3 scroll-smooth">
            {movies.map((movie) => {
              const rating =
                typeof movie.vote_average === "number" && movie.vote_average > 0
                  ? movie.vote_average.toFixed(1)
                  : null;
              const year = movie.release_date?.slice(0, 4);

              return (
                <Link
                  key={movie.id}
                  href={`/film/${movie.id}`}
                  className="flex-shrink-0 w-[130px] md:w-[150px] snap-start group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b50a] rounded-xl"
                >
                  <div className="relative w-[130px] md:w-[150px] aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-[#1c1a17] border border-[#33312c]/60 shadow-md">
                    <Image
                      src={posterUrl(movie.poster_path, "w500")}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 768px) 130px, 150px"
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    {rating && (
                      <div className="absolute top-2 right-2 bg-[#121110]/85 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                        <span className="text-[#f5b50a] text-[10px]">★</span>
                        <span className="text-white text-[11px] font-bold">
                          {rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-xs md:text-sm line-clamp-1 group-hover:text-[#f5b50a] transition-colors">
                    {movie.title}
                  </h3>
                  {year && (
                    <p className="text-[#a1a1aa] text-[11px] font-medium mt-0.5">
                      {year}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

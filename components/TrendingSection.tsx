import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types";
import { posterUrl } from "@/lib/tmdb";
import { FadeIn } from "./FadeIn";

export function TrendingSection({ movies }: { movies: Movie[] }) {
  return (
    <FadeIn delay={0.2}>
      <section className="w-full px-4 pb-24 md:pb-8">
        <h2 className="text-white font-bold text-lg mb-4">Trending Minggu Ini</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/film/${movie.id}`}
              className="flex-shrink-0 w-[140px] snap-start group"
            >
              <div className="relative w-[140px] h-[210px] rounded-lg overflow-hidden mb-2 bg-[#27272a]">
                <Image
                  src={posterUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  fill
                  sizes="140px"
                  loading="lazy"
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">
                {movie.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}

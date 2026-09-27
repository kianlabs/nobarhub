import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { TrailerPlayer } from "@/components/TrailerPlayer";
import {
  getMovieDetail,
  getMovieVideos,
  getSimilar,
  posterUrl,
} from "@/lib/tmdb";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId) || movieId <= 0) {
    return {
      title: "Film Tidak Ditemukan — NobarHub",
    };
  }

  try {
    const movie = await getMovieDetail(movieId);
    const title = `${movie.title} — NobarHub`;
    const description =
      movie.overview ||
      `Detail lengkap, sinopsis, dan trailer film ${movie.title} di NobarHub.`;

    const ogImages = movie.backdrop_path
      ? [{ url: posterUrl(movie.backdrop_path, "w1280") }]
      : movie.poster_path
      ? [{ url: posterUrl(movie.poster_path, "w500") }]
      : [];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "video.movie",
        images: ogImages,
      },
    };
  } catch {
    return {
      title: "Film Tidak Ditemukan — NobarHub",
    };
  }
}

function formatRuntime(minutes?: number): string {
  if (!minutes || minutes <= 0) return "—";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}j`;
  return `${hours}j ${remainingMinutes}m`;
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId) || movieId <= 0) {
    notFound();
  }

  let movie;
  let videos;
  let similar;

  try {
    [movie, videos, similar] = await Promise.all([
      getMovieDetail(movieId),
      getMovieVideos(movieId),
      getSimilar(movieId),
    ]);
  } catch {
    notFound();
  }

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "—";
  const runtimeFormatted = formatRuntime(movie.runtime);
  const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col selection:bg-cyan-500 selection:text-zinc-950">
      <Navbar />

      <main className="relative flex-1 pt-20 pb-20">
        {/* Backdrop sinematik dengan overlay gradien gelap */}
        {movie.backdrop_path && (
          <div className="absolute inset-x-0 top-0 h-[520px] sm:h-[620px] w-full overflow-hidden -z-10 pointer-events-none">
            <Image
              src={posterUrl(movie.backdrop_path, "w1280")}
              alt={movie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top opacity-20 filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-transparent to-[#09090b]" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tombol Navigasi Kembali */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Kembali ke Katalog</span>
            </Link>
          </div>

          {/* Hero Detail Section */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            {/* Poster Film */}
            <div className="relative aspect-[2/3] w-52 sm:w-64 md:w-72 lg:w-80 shrink-0 mx-auto md:mx-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/60">
              <Image
                src={posterUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                priority
                sizes="(max-width: 640px) 208px, (max-width: 768px) 256px, 320px"
                className="object-cover"
              />
            </div>

            {/* Informasi Film */}
            <div className="flex-1 flex flex-col gap-4 text-left">
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="mt-2 text-zinc-400 italic text-base sm:text-lg">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Metadata Badges: Rating, Year, Duration, Status */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                <span className="bg-zinc-900/90 border border-zinc-800 text-amber-400 text-sm font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{rating}</span>
                </span>

                <span className="text-zinc-500">•</span>
                <span className="font-medium text-zinc-300">{releaseYear}</span>

                <span className="text-zinc-500">•</span>
                <span className="font-medium text-zinc-300">{runtimeFormatted}</span>

                {movie.status && (
                  <>
                    <span className="text-zinc-500">•</span>
                    <span className="rounded-md bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400 border border-zinc-700/50">
                      {movie.status}
                    </span>
                  </>
                )}
              </div>

              {/* Genre Badges */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-zinc-800 text-zinc-300 text-xs font-medium px-3 py-1 rounded-full border border-zinc-700/50"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#trailer"
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold px-5 py-2.5 rounded-md transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  <span>Tonton Trailer</span>
                </a>

                {/* Streaming Placeholder */}
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
                  <span className="font-medium">Tonton Film Full — Segera Hadir</span>
                </div>
              </div>

              {/* Sinopsis */}
              <div className="space-y-2 pt-3 border-t border-zinc-800/60 mt-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sinopsis
                </h2>
                <p className="text-zinc-300 leading-relaxed text-base sm:text-lg max-w-3xl">
                  {movie.overview || "Sinopsis belum tersedia untuk film ini."}
                </p>
              </div>
            </div>
          </div>

          {/* Bagian Trailer */}
          <section id="trailer" className="mt-16 scroll-mt-24 space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Trailer</span>
                <span className="text-xs font-normal text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700/50">
                  YouTube Embed
                </span>
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Tonton cuplikan dan trailer dari film &ldquo;{movie.title}&rdquo;.
              </p>
            </div>

            <TrailerPlayer
              videos={videos?.results ?? []}
              title={movie.title}
            />
          </section>

          {/* Bagian Film Serupa */}
          {similar?.results && similar.results.length > 0 && (
            <section className="mt-20 space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Film Serupa
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Rekomendasi film lainnya yang memiliki tema atau genre serupa.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {similar.results.slice(0, 12).map((item) => (
                  <MovieCard key={item.id} movie={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-[#09090b] py-8 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} NobarHub. Data film disediakan oleh TMDB API.</p>
        <p className="mt-1 text-xs text-zinc-600">
          Trailer melalui YouTube embed. Tidak menyediakan konten bajakan.
        </p>
      </footer>
    </div>
  );
}

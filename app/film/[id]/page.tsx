import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovieDetail, getSimilar, getMovieCredits, posterUrl, backdropUrl } from "@/lib/tmdb";
import type { Genre } from "@/types";
import { HeroActions } from "@/components/HeroActions";
import { ShareButton } from "@/components/ShareButton";
import { CastSection } from "@/components/CastSection";
import { BackButton } from "@/components/BackButton";
import { TopNavbar } from "@/components/TopNavbar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { InteractiveMovieCard } from "@/components/InteractiveMovieCard";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieDetail(Number(id));
    const pstUrl = posterUrl(movie.poster_path, "w780");
    const desc = movie.overview || `Informasi tentang film ${movie.title} di NobarHub.`;
    return {
      title: `${movie.title} — NobarHub`,
      description: desc,
      openGraph: {
        title: `${movie.title} — NobarHub`,
        description: desc,
        images: movie.poster_path ? [{ url: pstUrl, width: 780, height: 1170, alt: movie.title }] : [],
        type: "video.movie",
      },
      twitter: {
        card: "summary_large_image",
        title: `${movie.title} — NobarHub`,
        description: desc,
        images: movie.poster_path ? [pstUrl] : [],
      },
    };
  } catch {
    return { title: "Film Tidak Ditemukan — NobarHub" };
  }
}

export default async function FilmDetailPage({ params }: Props) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) return notFound();

  let movie;
  let similarData;
  let credits;
  try {
    [movie, similarData, credits] = await Promise.all([
      getMovieDetail(movieId),
      getSimilar(movieId).catch(() => ({ results: [] })),
      getMovieCredits(movieId).catch(() => ({ id: movieId, cast: [] })),
    ]);
  } catch {
    return notFound();
  }

  const bgUrl = backdropUrl(movie.backdrop_path, "original");
  const pstUrl = posterUrl(movie.poster_path, "w500");
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";
  const runtime = movie.runtime ? `${movie.runtime} mnt` : "";
  const language = movie.original_language ? movie.original_language.toUpperCase() : "";

  return (
    <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative overflow-hidden pb-24 md:pb-0">
      <TopNavbar className="hidden md:block" />
      
      {/* Floating Back Button (Mobile only, tidak nabrak navbar) */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <BackButton />
      </div>

      <main className="flex-1 w-full">
        {/* Full-bleed Backdrop */}
        <section className="relative w-full h-[45vh] md:h-[60vh] min-h-[300px] mt-0 md:mt-16 bg-[#1c1a17]">
          <Image
            src={bgUrl}
            alt={movie.title}
            fill
            priority
            unoptimized
            className="object-cover"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121110]/80 to-transparent hidden md:block" />
        </section>

        {/* Details Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 -mt-20 md:-mt-32">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Poster (Desktop hidden from top, but let's show it on desktop next to content) */}
            <div className="hidden md:block shrink-0 w-[240px] lg:w-[300px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-[#33312c]">
              <div className="relative aspect-[2/3] w-full">
                <Image src={pstUrl} alt={movie.title} fill sizes="300px" className="object-cover" />
              </div>
            </div>

            <div className="flex-1 pt-4 md:pt-16 lg:pt-24 space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-[#a1a1aa] font-medium">
                <span className="text-[#f5b50a] font-bold">★ {rating}</span>
                {movie.imdb_id && (
                  <>
                    <span>•</span>
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f5c518] hover:bg-[#e2b616] text-black font-black text-xs px-2 py-0.5 rounded inline-flex items-center tracking-wider transition-colors"
                      title="Lihat di IMDb"
                    >
                      IMDb
                    </a>
                  </>
                )}
                <span>•</span>
                <span>{year}</span>
                {runtime && (
                  <>
                    <span>•</span>
                    <span>{runtime}</span>
                  </>
                )}
                {language && (
                  <>
                    <span>•</span>
                    <span className="border border-[#33312c] px-1.5 py-0.5 rounded text-xs bg-[#1c1a17]/50">{language}</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {movie.genres?.map((g: Genre) => (
                  <span key={g.id} className="px-3 py-1 bg-[#1c1a17] border border-[#33312c] rounded-full text-xs text-[#d4d4d8] font-medium">
                    {g.name}
                  </span>
                ))}
              </div>

              <div className="pt-2 max-w-2xl">
                <h3 className="text-sm font-bold text-white mb-2">Sinopsis</h3>
                <p className="text-[#a1a1aa] text-sm md:text-base leading-relaxed">
                  {movie.overview || "Sinopsis belum tersedia."}
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <div className="w-full sm:w-auto min-w-[280px] sm:min-w-[320px]">
                  {/* HeroActions handles Tonton Trailer and Watchlist toggle */}
                  <HeroActions movie={movie} />
                </div>
                <div className="pt-2 w-full sm:w-auto">
                  <ShareButton title={movie.title} text={`Tonton ${movie.title} di NobarHub`} className="w-full sm:w-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cast Section */}
        <CastSection cast={credits?.cast} />

        {/* Similar Movies */}
        {similarData && similarData.results.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <h2 className="text-lg font-bold text-white mb-4">Film Serupa</h2>
            <div className="flex md:grid gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x md:snap-none pb-4 md:pb-0 md:grid-cols-5 lg:grid-cols-6">
              {similarData.results.slice(0, 12).map(m => (
                <div key={m.id} className="min-w-[120px] md:min-w-0 snap-start">
                  <InteractiveMovieCard movie={m} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomTabBar />
    </div>
  );
}

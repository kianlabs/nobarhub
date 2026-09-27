import type { Metadata } from "next";
import { searchMovies, discoverMovies } from "@/lib/tmdb";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchFilters } from "@/components/SearchFilters";
import type { Movie } from "@/types";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    genre?: string;
    year?: string;
    rating?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Cari: "${q}" — NobarHub` : "Eksplorasi & Cari Film — NobarHub",
    description: "Cari dan temukan film berdasarkan genre, tahun rilis, dan rating di NobarHub.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, genre, year, rating } = await searchParams;

  const genreId = genre ? parseInt(genre, 10) : undefined;
  const releaseYear = year ? parseInt(year, 10) : undefined;
  const minRating = rating ? parseFloat(rating) : undefined;

  let movies: Movie[] = [];
  let errorMsg: string | null = null;

  try {
    if (q) {
      const response = await searchMovies(q);
      movies = response.results || [];

      // Saring di server jika filter tambahan dipilih bersama query pencarian
      if (genreId) {
        movies = movies.filter((m) => m.genre_ids?.includes(genreId));
      }
      if (releaseYear) {
        movies = movies.filter((m) =>
          m.release_date?.startsWith(releaseYear.toString())
        );
      }
      if (minRating) {
        movies = movies.filter((m) => m.vote_average >= minRating);
      }
    } else {
      // Panggil discoverMovies jika ada filter atau default eksplorasi
      const response = await discoverMovies({
        genre: genreId,
        year: releaseYear,
        minRating,
      });
      movies = response.results || [];
    }
  } catch (err) {
    console.error("Gagal memuat film:", err);
    errorMsg = "Gagal memuat data dari TMDB. Silakan periksa koneksi atau coba lagi nanti.";
  }

  const heading = q ? `Hasil: "${q}"` : "Katalog & Eksplorasi Film";
  const subtext = q
    ? `Ditemukan ${movies.length} film untuk kata kunci "${q}".`
    : "Gunakan filter di bawah atau cari judul di bilah atas untuk menemukan film.";

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {heading}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{subtext}</p>
        </div>

        {/* Filter controls */}
        <SearchFilters
          key={`${genre || ""}-${year || ""}-${rating || ""}-${q || ""}`}
          initialGenre={genre}
          initialYear={year}
          initialRating={rating}
          currentQuery={q}
        />

        {/* Error state */}
        {errorMsg && (
          <div className="mt-8 p-4 rounded-md bg-red-950/40 border border-red-900/60 text-red-200 text-sm">
            {errorMsg}
          </div>
        )}
        {/* Empty state */}
        {!errorMsg && movies.length === 0 && (
          <div className="mt-16 text-center py-16 border border-dashed border-zinc-700 rounded-lg">
            <p className="text-zinc-100 font-semibold text-base">
              Tidak ada film yang cocok.
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Coba gunakan kata kunci lain atau longgarkan filter pencarian.
            </p>
          </div>
        )}

        {/* Results grid */}
        {!errorMsg && movies.length > 0 && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <MovieGrid movies={movies} title="" />
          </div>
        )}
      </div>
    </main>
  );
}

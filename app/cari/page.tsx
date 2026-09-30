"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Movie, Genre } from "@/types";
import { InteractiveMovieCard } from "@/components/InteractiveMovieCard";
import { TopNavbar } from "@/components/TopNavbar";
import { BottomTabBar } from "@/components/BottomTabBar";

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2015, 2010];

export default function CariPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative shadow-2xl pt-20 md:pt-24 pb-24 md:pb-12">
          <TopNavbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin text-[#f5b50a]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>
          <BottomTabBar />
        </div>
      }
    >
      <CariWrapper />
    </Suspense>
  );
}

function CariWrapper() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  return <CariContent key={initialQ} initialQ={initialQ} />;
}

function CariContent({ initialQ }: { initialQ: string }) {
  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [results, setResults] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Sembunyikan bar pencarian saat scroll ke bawah agar tidak menghalangi konten
  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const handleScroll = () => {
      if (isInputFocused) {
        setIsHeaderVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY <= 40) {
        setIsHeaderVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY + 8) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY - 8) {
        setIsHeaderVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInputFocused]);
  const lastFetchedQueryRef = useRef<string | null>(null);
  // Fetch genre list
  useEffect(() => {
    let active = true;
    const loadGenres = async () => {
      try {
        const res = await fetch("/api/genres");
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data)) {
            setGenres(data);
          }
        }
      } catch {
        // Silently ignore
      }
    };
    loadGenres();
    return () => {
      active = false;
    };
  }, []);

  // Debounce logic (400ms for fast feedback)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Search or discover movies
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    // If searching by query and query hasn't changed, rely on client-side filter
    if (trimmed && trimmed === lastFetchedQueryRef.current) {
      return;
    }

    let url = "";
    if (trimmed) {
      url = `/api/movies/search?q=${encodeURIComponent(trimmed)}`;
    } else {
      const params = new URLSearchParams();
      if (selectedGenreId) params.append("genre", String(selectedGenreId));
      if (selectedYear) params.append("year", String(selectedYear));
      const queryString = params.toString();
      url = `/api/movies/search${queryString ? `?${queryString}` : ""}`;
    }

    let isCancelled = false;
    const doFetch = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal memuat film");
        const data = await res.json();
        if (!isCancelled) {
          setResults(data.results || []);
          lastFetchedQueryRef.current = trimmed ? trimmed : null;
        }
      } catch {
        if (!isCancelled) {
          setError("Gagal memuat daftar film.");
          lastFetchedQueryRef.current = null;
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    doFetch();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, selectedGenreId, selectedYear]);

  const filteredResults = results.filter((movie) => {
    if (debouncedQuery.trim()) {
      if (selectedGenreId && !movie.genre_ids?.includes(selectedGenreId)) {
        return false;
      }
      if (
        selectedYear &&
        !movie.release_date?.startsWith(String(selectedYear))
      ) {
        return false;
      }
    }
    return true;
  });

  const getHeadingTitle = () => {
    const genreName = genres.find((g) => g.id === selectedGenreId)?.name;

    if (debouncedQuery.trim()) {
      const activeFilters: string[] = [];
      if (genreName) activeFilters.push(genreName);
      if (selectedYear) activeFilters.push(String(selectedYear));

      return activeFilters.length > 0
        ? `Hasil Pencarian: "${debouncedQuery.trim()}" (${activeFilters.join(", ")})`
        : `Hasil Pencarian: "${debouncedQuery.trim()}"`;
    }

    if (selectedGenreId && selectedYear) {
      return `Film Kategori ${genreName || ""} (${selectedYear})`;
    }

    if (selectedGenreId) {
      return `Film Kategori ${genreName || ""}`;
    }

    if (selectedYear) {
      return `Film Rilis Tahun ${selectedYear}`;
    }

    return "Film Populer & Rekomendasi";
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query.trim());
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative shadow-2xl pt-1 md:pt-24 pb-28 md:pb-12">
      <TopNavbar className={`hidden md:block ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`} />

      {/* Search Header - Auto hide saat scroll ke bawah agar tidak menghalangi */}
      <div
        className={`sticky top-0 md:top-20 z-30 bg-[#121110]/95 md:bg-transparent backdrop-blur-md px-4 md:px-8 pt-3 pb-2.5 md:py-3 border-b border-[#33312c] md:border-none space-y-2.5 md:space-y-3 transition-transform duration-300 ease-in-out ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-[380px] pointer-events-none"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-7xl mx-auto flex items-center gap-2.5"
        >
          {/* Panjang input area yang membentang penuh (flex-1) */}
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Cari judul film, serial, atau genre..."
              aria-label="Cari judul film"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              className="w-full h-12 md:h-14 pl-12 pr-11 bg-[#1c1a17] text-white placeholder-[#71717a] text-sm md:text-base rounded-2xl border border-[#33312c] focus:outline-none focus:border-[#f5b50a] focus:ring-2 focus:ring-[#f5b50a]/40 transition-all shadow-inner [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#a1a1aa]"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            {/* Tombol Hapus / Clear Text */}
            {query.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-[#a1a1aa] hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Tombol Search Emas Responsif */}
          <button
            type="submit"
            aria-label="Cari sekarang"
            className="h-12 md:h-14 px-5 md:px-7 bg-[#f5b50a] hover:bg-[#d49b08] active:scale-95 text-[#121110] font-bold text-sm md:text-base rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f5b50a]/15 whitespace-nowrap cursor-pointer shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Cari</span>
          </button>
        </form>

        {/* Horizontal Genre Filter Pills */}
        {genres.length > 0 && (
          <div className="w-full max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto hide-scrollbar scrollbar-none pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedGenreId(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedGenreId === null
                  ? "bg-[#f5b50a] text-[#121110] shadow-sm font-semibold"
                  : "bg-[#1c1a17] text-[#a1a1aa] hover:text-white border border-[#33312c]"
              }`}
            >
              Semua Genre
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() =>
                  setSelectedGenreId(
                    selectedGenreId === genre.id ? null : genre.id
                  )
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedGenreId === genre.id
                    ? "bg-[#f5b50a] text-[#121110] shadow-sm font-semibold"
                    : "bg-[#1c1a17] text-[#a1a1aa] hover:text-white border border-[#33312c]"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}

        {/* Horizontal Year Filter Pills */}
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto hide-scrollbar scrollbar-none pb-0.5">
          <button
            type="button"
            onClick={() => setSelectedYear(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedYear === null
                ? "bg-[#f5b50a] text-[#121110] shadow-sm font-semibold"
                : "bg-[#1c1a17] text-[#a1a1aa] hover:text-white border border-[#33312c]"
            }`}
          >
            Semua Tahun
          </button>
          {YEARS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() =>
                setSelectedYear(selectedYear === year ? null : year)
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedYear === year
                  ? "bg-[#f5b50a] text-[#121110] shadow-sm font-semibold"
                  : "bg-[#1c1a17] text-[#a1a1aa] hover:text-white border border-[#33312c]"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <h2 className="text-white font-bold text-base md:text-lg">
            {getHeadingTitle()}
          </h2>
        </div>

        {isLoading && (
          <div className="text-center py-10 text-[#f5b50a]">
            <svg
              className="animate-spin h-8 w-8 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-sm">Memuat film...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-[#ef4444] text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredResults.length === 0 && (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 mx-auto text-[#33312c] mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.3-4.3"
              />
            </svg>
            <p className="text-[#a1a1aa]">
              {debouncedQuery.trim() ? (
                <>
                  Tidak ada hasil untuk <br />
                  <span className="text-white font-bold">
                    &quot;{debouncedQuery.trim()}&quot;
                  </span>
                  {selectedGenreId || selectedYear
                    ? " dengan filter yang dipilih"
                    : ""}
                </>
              ) : (
                "Tidak ada film yang ditemukan untuk filter yang dipilih."
              )}
            </p>
          </div>
        )}

        {!isLoading && filteredResults.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-6">
            {filteredResults.map((movie) => (
              <InteractiveMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
}

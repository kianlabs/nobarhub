"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Genre } from "@/types";

interface SearchFiltersProps {
  initialGenre?: string;
  initialYear?: string;
  initialRating?: string;
  currentQuery?: string;
}

export function SearchFilters({
  initialGenre = "",
  initialYear = "",
  initialRating = "",
  currentQuery = "",
}: SearchFiltersProps) {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genre, setGenre] = useState(initialGenre);
  const [year, setYear] = useState(initialYear);
  const [rating, setRating] = useState(initialRating);
  const [loadingGenres, setLoadingGenres] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadGenres() {
      try {
        const res = await fetch("/api/genres");
        if (!res.ok) throw new Error("Gagal mengambil data genre");
        const data: Genre[] = await res.json();
        if (isMounted) setGenres(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingGenres(false);
      }
    }
    loadGenres();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (currentQuery) params.set("q", currentQuery);
    if (genre) params.set("genre", genre);
    if (year) params.set("year", year);
    if (rating) params.set("rating", rating);

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  const handleReset = () => {
    setGenre("");
    setYear("");
    setRating("");
    if (currentQuery) {
      router.push(`/search?q=${encodeURIComponent(currentQuery)}`);
    } else {
      router.push("/search");
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const hasActiveFilters = Boolean(genre || year || rating);

  return (
    <form
      onSubmit={handleApply}
      className="flex flex-wrap items-center gap-3 pt-2 pb-6 border-b border-zinc-800 text-sm"
    >
      {/* Genre select */}
      <div className="flex items-center gap-2">
        <label htmlFor="filter-genre" className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">
          Genre
        </label>
        <select
          id="filter-genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          disabled={loadingGenres}
          className="bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
        >
          <option value="">Semua Genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id.toString()}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Year select */}
      <div className="flex items-center gap-2">
        <label htmlFor="filter-year" className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">
          Tahun
        </label>
        <select
          id="filter-year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-zinc-500"
        >
          <option value="">Semua Tahun</option>
          {years.map((y) => (
            <option key={y} value={y.toString()}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Rating select */}
      <div className="flex items-center gap-2">
        <label htmlFor="filter-rating" className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">
          Rating Min
        </label>
        <select
          id="filter-rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-zinc-500"
        >
          <option value="">Semua Rating</option>
          <option value="7">★ 7.0+</option>
          <option value="7.5">★ 7.5+</option>
          <option value="8">★ 8.0+</option>
          <option value="8.5">★ 8.5+</option>
        </select>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-md transition-colors cursor-pointer"
        >
          Terapkan
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 text-xs uppercase tracking-wider px-3 py-2 rounded-md transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}

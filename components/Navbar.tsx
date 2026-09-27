"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function SearchFormContent({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <svg
          className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul film..."
          className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded-md pl-9 pr-4 py-2 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </div>
    </form>
  );
}

function SearchForm() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  return <SearchFormContent key={q} initialQuery={q} />;
}

function SearchFallback() {
  return (
    <div className="relative flex items-center w-full">
      <svg
        className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        disabled
        placeholder="Cari judul film..."
        className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded-md pl-9 pr-4 py-2 cursor-default"
      />
    </div>
  );
}

export function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-zinc-950 border-b border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/"
            className="text-xl font-bold tracking-wider text-red-600 hover:text-red-500 transition-colors"
          >
            NOBARHUB
          </Link>
          <Link
            href="/search"
            className="hidden sm:inline-block text-xs uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Eksplorasi
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden sm:block flex-1 max-w-md">
          <Suspense fallback={<SearchFallback />}>
            <SearchForm />
          </Suspense>
        </div>

        {/* Mobile Search Toggle */}
        <div className="flex sm:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Buka pencarian"
            className="p-2 text-zinc-400 hover:text-white focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-zinc-700 bg-zinc-950">
          <Suspense fallback={<SearchFallback />}>
            <SearchForm />
          </Suspense>
        </div>
      )}
    </header>
  );
}

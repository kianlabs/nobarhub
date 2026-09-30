"use client";

import { useSyncExternalStore } from "react";
import type { Movie } from "@/types";

const STORAGE_KEY = "nobarhub-watchlist";
const MOVIES_STORAGE_KEY = "nobarhub-watchlist-movies";
const UPDATE_EVENT = "nobarhub-watchlist-updated";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(UPDATE_EVENT, callback);
  };
}

let cachedSnapshot: number[] = [];
let cachedRaw: string | null = null;

function getSnapshot(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      if (!raw) {
        cachedSnapshot = [];
      } else {
        const parsed = JSON.parse(raw);
        cachedSnapshot = Array.isArray(parsed) ? parsed : [];
      }
    }
    return cachedSnapshot;
  } catch {
    return cachedSnapshot;
  }
}

const emptyList: number[] = [];

export function useWatchlistIds(): number[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => emptyList);
}

export function useIsInWatchlist(movieId: number): boolean {
  const ids = useWatchlistIds();
  return ids.includes(movieId);
}

export function getCachedWatchlistMovies(): Movie[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MOVIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "object" && parsed !== null) {
      return Object.values(parsed);
    }
    return [];
  } catch {
    return [];
  }
}

export function cacheWatchlistMovies(movies: Movie[]): void {
  if (typeof window === "undefined") return;
  try {
    const movieMap: Record<number, Movie> = {};
    for (const m of movies) {
      movieMap[m.id] = m;
    }
    localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(movieMap));
  } catch {
    // ignore
  }
}

export function toggleWatchlistStorage(movieId: number, movieData?: Movie): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getSnapshot();
    const exists = current.includes(movieId);
    const nextIds = exists
      ? current.filter((id) => id !== movieId)
      : [...current, movieId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
    cachedRaw = JSON.stringify(nextIds);
    cachedSnapshot = nextIds;

    // Sinkronkan cache movie metadata
    try {
      const raw = localStorage.getItem(MOVIES_STORAGE_KEY);
      const map: Record<number, Movie> = raw ? JSON.parse(raw) : {};
      if (exists) {
        delete map[movieId];
      } else if (movieData) {
        map[movieId] = {
          id: movieData.id,
          title: movieData.title,
          overview: movieData.overview || "",
          poster_path: movieData.poster_path,
          backdrop_path: movieData.backdrop_path,
          release_date: movieData.release_date || "",
          vote_average: movieData.vote_average || 0,
          genre_ids: movieData.genre_ids || [],
          vote_count: movieData.vote_count,
        };
      }
      localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore metadata cache failure
    }

    window.dispatchEvent(new Event(UPDATE_EVENT));
    return !exists;
  } catch {
    return false;
  }
}

export function clearWatchlistStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, "[]");
    localStorage.setItem(MOVIES_STORAGE_KEY, "{}");
    cachedRaw = "[]";
    cachedSnapshot = [];
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // ignore
  }
}

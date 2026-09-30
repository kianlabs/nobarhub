import type { Genre, Movie, MovieDetail, MovieCredits, PagedResponse, Video } from "@/types";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function tmdb<T>(path: string): Promise<T> {
  if (!API_KEY) {
    throw new Error(
      "TMDB_API_KEY tidak ditemukan di environment variables. Silakan atur di .env.local."
    );
  }
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE_URL}${path}${sep}api_key=${API_KEY}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export const fetchTrending = (): Promise<PagedResponse<Movie>> =>
  tmdb<PagedResponse<Movie>>("/trending/movie/week?language=id-ID");

export const searchMovies = (query: string): Promise<PagedResponse<Movie>> =>
  tmdb<PagedResponse<Movie>>(
    `/search/movie?query=${encodeURIComponent(query)}&language=id-ID`
  );

export const getNowPlaying = (): Promise<PagedResponse<Movie>> =>
  tmdb<PagedResponse<Movie>>("/movie/now_playing?language=id-ID&page=1");

export const getTopRated = (): Promise<PagedResponse<Movie>> =>
  tmdb<PagedResponse<Movie>>("/movie/top_rated?language=id-ID&page=1");

export const getGenres = (): Promise<{ genres: Genre[] }> =>
  tmdb<{ genres: Genre[] }>("/genre/movie/list?language=id");

export const discoverMovies = (params: {
  genre?: number;
  year?: number;
  minRating?: number;
  page?: number;
}): Promise<PagedResponse<Movie>> => {
  const queryParts: string[] = ["language=id", "sort_by=popularity.desc"];
  if (params.genre) queryParts.push(`with_genres=${params.genre}`);
  if (params.year) queryParts.push(`primary_release_year=${params.year}`);
  if (params.minRating) queryParts.push(`vote_average.gte=${params.minRating}`, "vote_count.gte=100");
  if (params.page && params.page > 1) queryParts.push(`page=${params.page}`);
  return tmdb<PagedResponse<Movie>>(`/discover/movie?${queryParts.join("&")}`);
};

export const getMovieDetail = (id: number): Promise<MovieDetail> =>
  tmdb<MovieDetail>(`/movie/${id}?language=id-ID`);

export const getMovieVideos = (id: number): Promise<PagedResponse<Video>> =>
  tmdb<PagedResponse<Video>>(`/movie/${id}/videos?language=id-ID`);

export const fetchVideos = async (id: number): Promise<Video | null> => {
  // Get id-ID first
  let data = await tmdb<PagedResponse<Video>>(`/movie/${id}/videos?language=id-ID`).catch(() => null);
  let trailers = data?.results.filter((v) => v.site === "YouTube" && v.type === "Trailer") || [];
  
  // Fallback to en-US if no trailer found (very common in TMDB)
  if (trailers.length === 0) {
    data = await tmdb<PagedResponse<Video>>(`/movie/${id}/videos?language=en-US`).catch(() => null);
    trailers = data?.results.filter((v) => v.site === "YouTube" && v.type === "Trailer") || [];
  }
  return trailers.length > 0 ? trailers[0] : null;
};

export const getSimilar = (id: number): Promise<PagedResponse<Movie>> =>
  tmdb<PagedResponse<Movie>>(`/movie/${id}/similar?language=id-ID`);

export const getMovieCredits = (id: number): Promise<MovieCredits> =>
  tmdb<MovieCredits>(`/movie/${id}/credits?language=id-ID`);
export const posterUrl = (path: string | null, size = "w500"): string =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.svg";

export const backdropUrl = (path: string | null, size = "w1280"): string =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder-backdrop.svg";

export const profileUrl = (path: string | null, size = "w185"): string =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.svg";

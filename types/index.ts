export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  vote_count?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Movie {
  tagline?: string;
  genres: Genre[];
  runtime?: number;
  status?: string;
  original_language?: string;
  imdb_id?: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
}
export interface Video {
  id: string;
  key: string;
  site: string;
  type: string;
  official?: boolean;
}

export interface PagedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
}

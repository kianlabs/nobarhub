# Fase 4 — Setup dan integrasi API NobarHub

Panduan ini menyiapkan fondasi NobarHub dengan **Next.js App Router, TypeScript, Tailwind CSS, dan TMDB API**. Semua perintah dijalankan dari terminal; semua kode dapat langsung ditempel ke file yang disebutkan.

> **Penting:** TMDB menyediakan metadata film, poster, backdrop, dan referensi video/trailer. TMDB bukan sumber file streaming film penuh. Fitur streaming film penuh tetap memerlukan konten dan hak tayang yang legal.

---

## 1. Daftar dan mendapatkan kredensial TMDB

1. Buka `themoviedb.org` di browser.
2. Klik **Join TMDB**, isi formulir pendaftaran, lalu buat akun.
3. Buka email dari TMDB dan selesaikan verifikasi akun.
4. Masuk ke TMDB, buka foto profil, lalu pilih **Settings**.
5. Di menu kiri, pilih **API**.
6. Klik permintaan API key, pilih tipe **Developer**, lalu setujui ketentuan penggunaan.
7. Isi informasi aplikasi secara jujur:
   - **Application Name:** `NobarHub`
   - **Application URL:** URL portofolio, repositori, atau deployment milikmu jika diminta
   - **Application Summary:** aplikasi katalog dan pencarian film untuk proyek portofolio
   - Isi data lain sesuai keadaan sebenarnya.
8. Kirim formulir dan tunggu sampai akses tersedia.
9. Pada halaman **Settings → API**, salin **API Read Access Token**.

Panduan ini menyimpan **API Read Access Token** tersebut di variabel `TMDB_API_KEY`. Walau namanya memakai kata `KEY`, nilai yang ditempel adalah token panjang untuk autentikasi Bearer, bukan nilai pendek **API Key (v3 auth)**.

**Jangan** menempel token ke source code, commit Git, screenshot, atau variabel yang diawali `NEXT_PUBLIC_`.

---

## 2. Scaffold proyek Next.js

Jalankan:

```bash
npx create-next-app@latest nobarhub
```

Pilih jawaban berikut saat prompt muncul:

```text
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
Would you like to use Tailwind CSS? Yes
Would you like your code inside a src/ directory? No
Would you like to use App Router? Yes
Would you like to use Turbopack? Yes
Would you like to customize the import alias? No
```

Jika versi `create-next-app` menampilkan prompt tambahan, pertahankan opsi default kecuali proyek memang membutuhkan pilihan lain. Setelah scaffold selesai:

```bash
cd nobarhub
npm install server-only
```

`server-only` memberi proteksi build-time agar modul TMDB yang memegang token tidak sengaja diimpor oleh Client Component.

Jalankan pengecekan awal:

```bash
npm run dev
```

Buka `http://localhost:3000`. Hentikan server dengan `Ctrl+C` sebelum lanjut.

---

## 3. Struktur folder

Buat folder yang belum tersedia:

```bash
mkdir -p components lib types app/api/movies/trending
```

Struktur minimum setelah Fase 4:

```text
nobarhub/
├── app/
│   ├── api/
│   │   └── movies/
│   │       └── trending/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── MovieCard.tsx          # opsional untuk refactor berikutnya
├── lib/
│   └── tmdb.ts
├── public/
├── types/
│   ├── movie.ts
│   └── video.ts
├── .env.local
├── .gitignore
├── next.config.mjs
├── package.json
└── tsconfig.json
```

- **`app/`**: halaman, layout, loading/error state, dan Route Handler App Router.
- **`components/`**: komponen UI yang dapat dipakai ulang, misalnya kartu film dan navbar.
- **`lib/`**: fungsi akses data serta logika server, termasuk wrapper TMDB.
- **`types/`**: tipe TypeScript untuk respons dan model data.
- **`public/`**: aset statis milik proyek.

> **Catatan:** panduan ini memilih **No** untuk `src/` agar path persis seperti contoh. Jika memilih `src/`, pindahkan `app/`, `components/`, `lib/`, dan `types/` ke dalam `src/` secara konsisten.

---

## 4. Environment dan keamanan token

Buat `.env.local` di root proyek:

```bash
touch .env.local
```

Isi file tersebut:

```dotenv
TMDB_API_KEY=paste_api_read_access_token_di_sini
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

- **`TMDB_API_KEY`** adalah rahasia dan hanya boleh dibaca di server.
- **`NEXT_PUBLIC_TMDB_IMAGE_BASE_URL`** boleh tersedia di browser karena hanya alamat CDN gambar, bukan kredensial.
- Setelah mengubah `.env.local`, restart development server.

Pastikan `.gitignore` memiliki aturan berikut:

```gitignore
.env*
!.env.example
```

Buat `.env.example` agar anggota tim tahu nama variabel tanpa melihat token:

```bash
cat > .env.example <<'EOF'
TMDB_API_KEY=
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
EOF
```

Cek bahwa file rahasia tidak akan ikut commit:

```bash
git check-ignore -v .env.local
```

Perintah tersebut harus menampilkan aturan `.gitignore` yang mengabaikan `.env.local`.

### Pola aman yang dipakai

1. `lib/tmdb.ts` diawali `import "server-only"`.
2. Server Component memanggil `lib/tmdb.ts` langsung di server.
3. Client Component tidak pernah membaca `process.env.TMDB_API_KEY`.
4. Jika browser perlu mengambil data secara interaktif, browser memanggil Route Handler milik NobarHub; Route Handler-lah yang memanggil TMDB.
5. Respons dan pesan error tidak pernah mengembalikan nilai token.

---

## 5. Tipe data TypeScript

### `types/movie.ts`

```ts
export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number | null;
  tagline?: string;
  status?: string;
};
```

### `types/video.ts`

```ts
export type Video = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
};
```

---

## 6. Wrapper TMDB siap pakai

Buat `lib/tmdb.ts`:

```ts
import "server-only";

import type { Movie } from "@/types/movie";
import type { Video } from "@/types/video";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const DEFAULT_LANGUAGE = "id-ID";

type QueryValue = string | number | boolean | undefined;

type TmdbListResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

type TmdbVideosResponse = {
  id: number;
  results: Video[];
};

async function tmdbFetch<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  revalidate = 3600,
): Promise<T> {
  const token = process.env.TMDB_API_KEY;

  if (!token) {
    throw new Error(
      "TMDB_API_KEY belum diatur. Tambahkan API Read Access Token ke .env.local.",
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(
      `Permintaan TMDB gagal (${response.status} ${response.statusText}).`,
    );
  }

  return (await response.json()) as T;
}
```

Lanjutkan pada file yang sama, tepat setelah fungsi `tmdbFetch`:

```ts
export async function fetchTrending(): Promise<Movie[]> {
  const data = await tmdbFetch<TmdbListResponse<Movie>>(
    "/trending/movie/day",
    { language: DEFAULT_LANGUAGE },
    3600,
  );

  return data.results;
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<Movie[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const data = await tmdbFetch<TmdbListResponse<Movie>>(
    "/search/movie",
    {
      query: normalizedQuery,
      page,
      language: DEFAULT_LANGUAGE,
      include_adult: false,
    },
    300,
  );

  return data.results;
}

export async function getMovieDetail(movieId: number): Promise<Movie> {
  return tmdbFetch<Movie>(
    `/movie/${movieId}`,
    { language: DEFAULT_LANGUAGE },
    3600,
  );
}

export async function getMovieVideos(movieId: number): Promise<Video[]> {
  const data = await tmdbFetch<TmdbVideosResponse>(
    `/movie/${movieId}/videos`,
    { language: DEFAULT_LANGUAGE },
    3600,
  );

  return data.results;
}

export async function getSimilar(movieId: number): Promise<Movie[]> {
  const data = await tmdbFetch<TmdbListResponse<Movie>>(
    `/movie/${movieId}/similar`,
    { language: DEFAULT_LANGUAGE, page: 1 },
    3600,
  );

  return data.results;
}
```

### Ringkasan fungsi

- **`fetchTrending()`**: film trending harian.
- **`searchMovies(query, page)`**: pencarian judul film; input kosong langsung menghasilkan array kosong.
- **`getMovieDetail(movieId)`**: detail satu film.
- **`getMovieVideos(movieId)`**: metadata trailer/teaser yang tersedia di TMDB.
- **`getSimilar(movieId)`**: rekomendasi film serupa.

`revalidate` menentukan interval cache dalam detik. Trending, detail, video, dan film serupa memakai 1 jam; pencarian memakai 5 menit.

> **Catatan:** `getMovieVideos()` mengembalikan metadata video, bukan file film penuh. Sebelum menampilkan tombol trailer, filter setidaknya `site === "YouTube"` dan `type === "Trailer"`.

---

## 7. Izinkan gambar TMDB di Next.js

Buat atau ganti isi `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
```

Jika scaffold menghasilkan `next.config.ts`, hapus file tersebut setelah membuat `next.config.mjs` agar tidak ada dua konfigurasi aktif:

```bash
rm -f next.config.ts
```

---

## 8. Contoh Server Component untuk homepage

Ganti isi `app/page.tsx`:

```tsx
import Image from "next/image";

import { fetchTrending } from "@/lib/tmdb";

export default async function HomePage() {
  const movies = await fetchTrending();
  const imageBaseUrl =
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL ??
    "https://image.tmdb.org/t/p/w500";

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
            NobarHub
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Film trending hari ini
          </h1>
        </div>

        {movies.length === 0 ? (
          <p className="text-zinc-400">Belum ada film untuk ditampilkan.</p>
        ) : (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie) => (
              <article
                key={movie.id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
              >
                {movie.poster_path ? (
                  <Image
                    src={`${imageBaseUrl}${movie.poster_path}`}
                    alt={`Poster ${movie.title}`}
                    width={500}
                    height={750}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center bg-zinc-800 p-4 text-center text-sm text-zinc-400">
                    Poster tidak tersedia
                  </div>
                )}

                <div className="p-4">
                  <h2 className="line-clamp-2 font-semibold">{movie.title}</h2>
                  <div className="mt-2 flex items-center justify-between text-sm text-zinc-400">
                    <span>{movie.release_date?.slice(0, 4) || "-"}</span>
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
```

`app/page.tsx` adalah Server Component secara default karena tidak memakai directive `"use client"`. Karena itu, pemanggilan `fetchTrending()` berjalan di server dan token tidak masuk ke bundle browser.

---

## 9. Route Handler aman untuk kebutuhan Client Component

Homepage di atas tidak memerlukan Route Handler. Namun, pencarian interaktif atau tombol “muat lagi” biasanya dijalankan dari Client Component. Dalam kasus itu, browser harus memanggil endpoint internal NobarHub, bukan TMDB secara langsung.

Buat `app/api/movies/trending/route.ts`:

```ts
import { NextResponse } from "next/server";

import { fetchTrending } from "@/lib/tmdb";

export async function GET() {
  try {
    const movies = await fetchTrending();

    return NextResponse.json({ results: movies });
  } catch (error) {
    console.error("Gagal mengambil film trending:", error);

    return NextResponse.json(
      { message: "Gagal mengambil film trending." },
      { status: 500 },
    );
  }
}
```

Client Component nantinya cukup meminta `/api/movies/trending`. Token tetap digunakan oleh server dan tidak pernah dikirim dalam JSON.

**Jangan lakukan pola berikut di Client Component:**

```tsx
"use client";

// SALAH: token rahasia tidak boleh diakses atau dikirim dari browser.
const token = process.env.TMDB_API_KEY;
```

---

## 10. Test cepat

### A. Jalankan pemeriksaan kode

```bash
npm run lint
npm run build
```

Keduanya harus selesai tanpa error TypeScript atau ESLint.

### B. Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:3000` dan pastikan:

- judul **Film trending hari ini** terlihat;
- kartu film muncul dari data TMDB;
- poster, judul, tahun, dan rating tampil;
- terminal tidak menampilkan error autentikasi.

### C. Uji Route Handler

Buka terminal kedua dari folder proyek:

```bash
curl http://localhost:3000/api/movies/trending
```

Respons yang benar berbentuk JSON dengan properti `results`. Respons tersebut tidak boleh berisi `TMDB_API_KEY` atau Authorization header.

### D. Diagnosis error umum

**Pesan `TMDB_API_KEY belum diatur`:**

```bash
# pastikan file ada di root proyek
ls -la .env.local

# lalu restart server
npm run dev
```

**Status `401 Unauthorized`:** pastikan nilai `TMDB_API_KEY` adalah **API Read Access Token**, tidak memiliki tanda kutip tambahan, spasi, atau awalan `Bearer `. Kode sudah menambahkan awalan Bearer otomatis.

**Gambar tidak tampil:** pastikan `NEXT_PUBLIC_TMDB_IMAGE_BASE_URL` benar, `poster_path` tidak `null`, dan development server telah direstart setelah konfigurasi berubah.

**Perubahan env tidak terbaca:** hentikan server dengan `Ctrl+C`, lalu jalankan kembali `npm run dev`.

---

## 11. Checklist akhir Fase 4

### Akun dan konfigurasi

- [ ] Akun TMDB sudah dibuat dan email sudah diverifikasi.
- [ ] Permintaan API tipe **Developer** sudah diajukan.
- [ ] **API Read Access Token** sudah tersedia.
- [ ] `.env.local` sudah berisi `TMDB_API_KEY` dan base URL gambar.
- [ ] `.env.local` terbukti diabaikan oleh Git.
- [ ] `.env.example` tersedia tanpa nilai rahasia.

### Struktur dan kode

- [ ] Proyek memakai TypeScript, Tailwind CSS, dan App Router.
- [ ] Folder `app/`, `components/`, `lib/`, dan `types/` tersedia.
- [ ] `types/movie.ts` dan `types/video.ts` sudah dibuat.
- [ ] `lib/tmdb.ts` memakai `server-only` dan Authorization Bearer.
- [ ] Fungsi trending, search, detail, videos, dan similar sudah tersedia.
- [ ] `next.config.mjs` mengizinkan host gambar TMDB.
- [ ] Homepage mengambil trending lewat Server Component.
- [ ] Route Handler tidak mengembalikan token ke browser.

### Verifikasi

- [ ] `npm run lint` berhasil.
- [ ] `npm run build` berhasil.
- [ ] `npm run dev` berjalan.
- [ ] Homepage menampilkan data film aktual dari TMDB.
- [ ] Endpoint internal trending menghasilkan JSON.
- [ ] Token tidak ada di source code, Git, respons API, atau browser bundle.

Fase 4 selesai ketika seluruh checklist di atas terpenuhi. Fondasi ini siap dilanjutkan ke fitur pencarian, halaman detail, trailer, watchlist, loading state, error state, dan integrasi sumber streaming legal pada fase berikutnya.

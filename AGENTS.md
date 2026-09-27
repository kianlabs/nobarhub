# AGENTS.md — NobarHub

## Proyek

NobarHub: website katalog film (portofolio). Next.js App Router + TypeScript + Tailwind CSS.
Bahasa UI: Indonesia. Tema: PWA mobile-first, dark cinematic charcoal + aksen emas.

## Struktur

- `app/` — App Router, server components by default
- `lib/tmdb.ts` — helper TMDB API v3: fetchTrending, searchMovies, getMovieDetails, getMovieVideos, getSimilarMovies, posterUrl
- `types/index.ts` — tipe Movie, Video, PagedResponse
- Path alias `@/` → root proyek (lihat tsconfig.json)

## Aturan main

- Semua teks UI Bahasa Indonesia.
- JANGAN commit `.env.local` (berisi TMDB_API_KEY v3).
- Konten legal saja: trailer via YouTube embed + placeholder "Tonton Film Full — Segera Hadir". Jangan buat fitur streaming film bajakan.
- Ikuti pola yang sudah ada di lib/ dan types/ sebelum bikin helper/tipe baru.
- Perintah: `npm run dev` (jalanin), `npm run build` (cek error build).

## Cara kerja dengan saya

- Saya lagi belajar coding — jelaskan konsep singkat dulu sebelum nulis kode, jangan langsung dump file besar sekaligus.
- Kalau ada beberapa cara, kasih 1 rekomendasi terbaik + alasan singkat.
- Komunikasi Bahasa Indonesia, santai, langsung ke intinya.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

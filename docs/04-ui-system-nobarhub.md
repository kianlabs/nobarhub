# UI System Mini — NobarHub

Panduan visual ringkas untuk MVP NobarHub, website katalog film dengan nuansa **dark cinematic**. Gunakan token di dokumen ini agar implementasi Next.js, TypeScript, dan Tailwind CSS tetap konsisten tanpa membangun design system yang berlebihan.

## Prinsip visual

- **PWA-first & mobile portrait**: desain dirancang optimal untuk mobile dengan navigasi bawah.
- **Gelap & sinematik**: gunakan charcoal dark `#121110` sebagai dasar.
- **Emas secara selektif**: aksen amber/emas `#f5b50a` hanya untuk aksi utama dan fokus penting.
- **Gerakan singkat**: transisi 150–200 ms; hindari animasi yang mengganggu eksplorasi katalog.
- **Aksesibel**: teks utama minimal berkontras tinggi dan semua aksi dapat dipakai dengan keyboard.

---

## 1. Color palette

### Background dan surface

| Peran | Hex | Token Tailwind |
|---|---|---|
| Latar utama | `#121110` | `cinema-950` |
| Latar sekunder | `#1A1918` | `cinema-900` |
| Kartu/surface | `#18181B` | `cinema-850` |
| Surface hover | `#232326` | `cinema-800` |
| Border halus | `#2D2D31` | `cinema-700` |

### Aksen dan teks

| Peran | Hex | Token Tailwind |
|---|---|---|
| Emas primer | `#f5b50a` | `brand-500` |
| Emas hover | `#d49b08` | `brand-400` |
| Emas ditekan | `#b48307` | `brand-600` |
| Teks utama | `#FAFAFA` | `ink-primary` |
| Teks sekunder | `#B3B3B8` | `ink-secondary` |
| Teks redup | `#73737A` | `ink-muted` |
| Teks nonaktif | `#52525B` | `ink-disabled` |

### Status

| Status | Hex | Token Tailwind |
|---|---|---|
| Sukses | `#22C55E` | `status-success` |
| Error | `#EF4444` | `status-error` |
| Warning | `#F59E0B` | `status-warning` |
| Info | `#3B82F6` | `status-info` |

**Aturan pakai:**

- Gunakan `cinema-950` untuk `body`, `cinema-900` untuk section, dan `cinema-850` untuk kartu/dialog.
- Gunakan `brand-500` hanya untuk CTA utama, PWA install banner, item aktif, dan indikator penting.
- Gunakan `ink-primary` untuk judul; `ink-secondary` untuk metadata; `ink-muted` untuk bantuan atau keterangan.
- Untuk focus ring gunakan `ring-2 ring-brand-500 ring-offset-2 ring-offset-cinema-950`.

---

## 2. Typography

### Font

**Utama:** Plus Jakarta Sans melalui `next/font/google`. Bentuknya modern, ramah, dan tetap kuat untuk judul film.

**Alternatif:** Inter jika prioritasnya keterbacaan maksimum dan tampilan lebih netral.

```tsx
import { Plus_Jakarta_Sans } from "next/font/google";

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
```

### Skala ukuran

| Gaya | Ukuran / line-height | Kegunaan |
|---|---|---|
| Display | `48px/56px` · `3rem` | Hero desktop |
| Display mobile | `36px/44px` · `2.25rem` | Hero mobile |
| Heading 1 | `32px/40px` · `2rem` | Judul halaman |
| Heading 2 | `24px/32px` · `1.5rem` | Judul section |
| Heading 3 | `20px/28px` · `1.25rem` | Judul kartu besar |
| Body lg | `18px/28px` · `1.125rem` | Sinopsis pendek |
| Body | `16px/24px` · `1rem` | Isi utama |
| Body sm | `14px/20px` · `0.875rem` | Metadata |
| Caption | `12px/16px` · `0.75rem` | Label kecil |

**Bobot:** `700` untuk display/heading, `600` untuk tombol dan label, `400` untuk body. Batasi judul kartu maksimal dua baris dengan `line-clamp-2`.

---

## 3. Spacing, radius, dan shadow

### Spacing

Gunakan skala bawaan Tailwind dan prioritaskan nilai berikut:

| Token | Nilai | Pemakaian |
|---|---:|---|
| `1` | 4 px | Jarak mikro |
| `2` | 8 px | Ikon dan label |
| `3` | 12 px | Isi chip |
| `4` | 16 px | Padding kartu |
| `6` | 24 px | Jarak komponen |
| `8` | 32 px | Jarak section kecil |
| `12` | 48 px | Jarak section |
| `16` | 64 px | Jarak section besar |

**Layout:** container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`; grid katalog `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6` dengan `gap-4 md:gap-6`.

### Border radius

| Token | Nilai | Pemakaian |
|---|---:|---|
| `rounded-md` | 6 px | Input, chip |
| `rounded-lg` | 8 px | Tombol |
| `rounded-xl` | 12 px | Kartu/panel |
| `rounded-full` | 9999 px | Badge bulat |

### Shadow

- **Kartu normal:** tanpa shadow; gunakan border tipis agar halaman tidak terasa ramai.
- **Kartu hover:** `shadow-card` dan `ring-1 ring-white/10`.
- **Overlay:** `shadow-overlay` untuk dropdown, modal, atau panel mengambang.

---
## 4. Komponen reusable

### Button

**Tampilan:** tinggi `40px`, padding horizontal `16px`, `rounded-lg`, teks `14px/600`, ikon `18–20px`. Area sentuh mobile minimal `44px`.

**Varian:**

- **Primary**: `bg-brand-500 text-white`; hover `bg-brand-400`; active `bg-brand-600`.
- **Ghost**: `bg-white/10 text-white`; hover `bg-white/15`; cocok untuk aksi sekunder.
- **Disabled**: `bg-cinema-700 text-ink-disabled cursor-not-allowed`; tanpa hover.

**Perilaku:** tampilkan focus ring saat keyboard focus. Saat proses berjalan, nonaktifkan klik, tampilkan spinner, tetapi pertahankan lebar tombol agar layout tidak bergeser.

### MovieCard

**Tampilan:** poster rasio `2/3`, `rounded-xl`, judul di bawah poster, metadata singkat, `RatingBadge` di pojok atas. Gunakan `overflow-hidden` pada area poster.

**Varian:** default untuk grid; compact untuk baris rekomendasi atau hasil pencarian sempit.

**Perilaku:**

- Hover desktop: poster `scale-[1.03]`, overlay gradien muncul, shadow menguat; durasi 200 ms.
- Fokus keyboard: ring terlihat pada keseluruhan kartu.
- Klik kartu membuka detail film; tombol watchlist harus aksi terpisah dan tidak memicu navigasi.
- Poster gagal dimuat: tampilkan surface gelap dengan ikon film dan judul.

### Badge / GenreChip

**Tampilan:** `rounded-full`, tinggi `28–32px`, padding `px-3`, teks caption `600`, border `white/10`.

**Varian:** neutral `bg-white/5`; active `bg-brand-500 text-white`; disabled memakai teks redup.

**Perilaku:** chip filter dapat dipilih/dibatalkan. Gunakan `aria-pressed` dan jangan hanya mengandalkan warna untuk menandai kondisi aktif.

### Bottom Tab Bar (Navigasi Mobile)

**Tampilan:** sticky di bawah layar `fixed bottom-0`, `bg-cinema-950/90 backdrop-blur-md`, border atas tipis. Isi: Beranda, Cari, Watchlist, Profil.

**Varian:**

- Mobile: Tab bar mendominasi navigasi (PWA-first).
- Desktop: Tab bar disembunyikan, diganti sidebar atau top navbar sederhana.

**Perilaku:** Tautan halaman aktif memakai ikon emas (`brand-500`) dan teks warna terang. Tab Cari membuka layar pencarian secara instan.

### PWA Install Banner

**Tampilan:** Banner emas `bg-brand-500` teks gelap di bawah layar (di atas tab bar). Teks: "Pasang NobarHub ke Layar Utama • Pasang" dengan tombol X (tutup).
### SkeletonLoader

**Tampilan:** bentuk mengikuti konten asli; poster memakai rasio `2/3`, teks memakai balok dengan panjang bervariasi. Warna `cinema-850` dengan shimmer halus.

**Varian:** `MovieCardSkeleton`, `DetailSkeleton`, dan `RowSkeleton`.

**Perilaku:** tampil hanya saat pengambilan awal atau pergantian halaman. Hormati `prefers-reduced-motion`; gunakan pulse tanpa shimmer bila gerakan dikurangi.

### EmptyState

**Tampilan:** panel terpusat dengan ikon sederhana, judul singkat, penjelasan satu kalimat, dan satu aksi.

**Varian:** hasil pencarian kosong dan watchlist kosong.

**Perilaku:** aksi menghapus filter, kembali ke katalog, atau menjelajahi film. Hindari pesan yang menyalahkan pengguna.

### ErrorState

**Tampilan:** ikon error, judul jelas, pesan ringkas, tombol `Coba lagi`, dan aksi kembali jika relevan.

**Varian:** section-level untuk satu blok gagal; page-level jika halaman tidak dapat digunakan.

**Perilaku:** retry mengulang request tanpa reload penuh. Detail teknis hanya masuk log pengembangan, bukan pesan pengguna.

### RatingBadge

**Tampilan:** pill kecil `bg-black/70 backdrop-blur`, ikon bintang warna warning, nilai satu desimal, teks `12px/600`.

**Varian:** overlay di poster dan inline di halaman detail.

**Perilaku:** tampilkan `—` bila rating tidak tersedia. Sertakan label aksesibel seperti `Rating 8,2 dari 10`.

### WatchlistButton

**Tampilan:** ikon bookmark atau plus dengan label opsional. Pada kartu gunakan tombol ikon `40px`; pada detail gunakan Button ghost/primary.

**Varian:** `Tambah ke watchlist`, `Tersimpan`, hover, focus, dan disabled.

**Perilaku:** perubahan langsung terasa di UI dan disimpan ke `localStorage`. Berikan toast singkat. Gunakan `aria-pressed`; cegah event bubbling saat berada di dalam kartu.

---
## 5. Konfigurasi Tailwind

Contoh berikut ditujukan untuk proyek yang memakai `tailwind.config.ts`.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          950: "#121110",
          900: "#1A1918",
          850: "#262524",
          800: "#333130",
          700: "#403E3C",
        },
        brand: {
          400: "#d49b08",
          500: "#f5b50a",
          600: "#b48307",
        },
        ink: {
          primary: "#FAFAFA",
          secondary: "#B3B3B8",
          muted: "#73737A",
          disabled: "#52525B",
        },
        status: {
          success: "#22C55E",
          error: "#EF4444",
          warning: "#F59E0B",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 12px 30px rgba(0, 0, 0, 0.35)",
        overlay: "0 20px 50px rgba(0, 0, 0, 0.55)",
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
```

Contoh dasar pada `app/layout.tsx`:

```tsx
import { jakarta } from "@/lib/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="bg-cinema-950 font-sans text-ink-primary antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## 6. Aturan praktis implementasi

### Buat komponen baru jika

- Pola yang sama muncul di **dua tempat atau lebih**.
- Elemen memiliki state sendiri, misalnya loading, active, selected, atau error.
- Interaksi membutuhkan aksesibilitas yang konsisten, seperti dialog, tombol, atau filter chip.
- Komponen punya identitas produk yang jelas, seperti `MovieCard`, `RatingBadge`, atau `WatchlistButton`.

### Modifikasi komponen yang ada jika

- Perbedaannya hanya warna, ukuran, ikon, atau posisi; tambahkan `variant`, `size`, atau `className`.
- Struktur dan perilaku dasarnya sama.
- Variasi masih mudah dipahami tanpa banyak kondisi bercabang.

### Pisahkan komponen jika

- Props mulai sulit dimengerti atau banyak kombinasi tidak valid.
- Satu file menangani dua perilaku yang benar-benar berbeda.
- Perubahan pada satu varian sering merusak varian lain.

### Konvensi singkat

- Simpan komponen dasar di `components/ui`, sedangkan komponen domain film di `components/movie`.
- Gunakan satu sumber tipe data film, misalnya `types/movie.ts`.
- Gunakan helper seperti `cn()` untuk menggabungkan class, bukan menyusun string panjang berulang kali.
- Jangan menulis hex langsung di komponen; gunakan token warna.
- Selalu sediakan state loading, kosong, error, hover, focus, dan disabled jika relevan.
- Pastikan komponen interaktif dapat diakses dengan Tab, Enter/Space, dan Escape sesuai konteks.
- Uji minimal pada lebar 375 px, 768 px, 1024 px, dan 1440 px.

## Checklist sebelum mulai ngoding fitur

- [ ] Font dan token Tailwind sudah terpasang.
- [ ] `Button`, `MovieCard`, `GenreChip`, dan state dasar sudah reusable.
- [ ] Warna aksen tidak dipakai berlebihan.
- [ ] Grid katalog responsif dari mobile ke desktop.
- [ ] Hover memiliki padanan focus keyboard.
- [ ] Loading, empty, dan error tidak menggeser layout secara ekstrem.
- [ ] Watchlist tersimpan dan status tombol selalu sinkron.

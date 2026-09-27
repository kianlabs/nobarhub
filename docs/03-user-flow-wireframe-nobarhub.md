# User flow dan wireframe low-fidelity NobarHub

Dokumen ini jadi pegangan kasar saat ngoding MVP NobarHub. Fokusnya struktur layar, urutan interaksi, dan state penting—belum masuk warna, font, spacing presisi, atau animasi.

## Ringkasan produk

- **Platform:** Next.js + TypeScript + Tailwind CSS
- **Data film:** TMDB API
- **Video MVP:** trailer resmi melalui embed YouTube
- **Watchlist:** `localStorage`
- **Deployment:** Vercel
- **Batasan penting:** tombol **“Tonton Film Full — Segera Hadir”** hanya elemen UI non-fungsional. NobarHub tidak memutar film penuh pada MVP.

---

## 1. Diagram alur pengguna

### Alur utama

```text
[Homepage]
    |
    +--> Pilih film dari hero/row genre -------------------+
    |                                                      |
    +--> Ketik kata kunci --> [Hasil pencarian] --> Pilih film
    |                              |
    +--> Buka katalog --> Filter genre/tahun --> Pilih film
                                                           |
                                                           v
                                                   [Detail film]
                                                     |      |
                                   Tambah watchlist -+      +--> Tonton trailer
                                                     |                |
                                                     v                v
                                                [Watchlist]    [Halaman nonton]
                                                     |                |
                                                     +--> Pilih film -+
                                                                      |
                                                                      v
                                                       Putar trailer YouTube
                                                                      |
                                                                      v
                                                Lihat tombol film full non-fungsional
```

### Alur pencarian

```text
Isi kolom pencarian
    |
    +--> Ada kata kunci --> Tampilkan skeleton --> Hasil ditemukan --> Grid film
    |                                              |
    |                                              +--> Klik kartu --> Detail film
    |
    +--> Kata kunci kosong --> Tampilkan katalog/trending awal
    |
    +--> Tidak ada hasil --> Empty state + saran ubah kata kunci/filter
    |
    +--> API gagal --> Pesan error + tombol "Coba lagi"
```

### Alur detail, nonton, dan watchlist

```text
[Detail film]
    |
    +--> Klik "Tonton Trailer"
    |        |
    |        +--> Trailer tersedia --> [Halaman nonton] --> Putar embed YouTube
    |        |
    |        +--> Trailer tidak tersedia --> Info "Trailer belum tersedia"
    |
    +--> Klik "+ Watchlist" --> Simpan ID film ke localStorage
    |                              |
    |                              +--> Tombol berubah jadi "Hapus dari Watchlist"
    |
    +--> Klik film serupa --> Buka detail film terpilih

[Watchlist]
    |
    +--> Ada data --> Grid film --> Klik kartu --> Detail film
    |
    +--> Kosong --> Empty state --> Tombol "Jelajahi Film" --> Homepage/Katalog
```

### Aturan navigasi sederhana
- Logo **NobarHub** selalu kembali ke Homepage.
- Aplikasi menggunakan desain PWA-first mobile portrait: navigasi utama ada di Bottom Tab Bar (Beranda, Cari, Watchlist, Profil). Desktop memiliki top navbar/sidebar.
- Tombol kembali pada Detail dan Nonton memakai riwayat browser; jika tidak ada, arahkan ke Homepage.
- URL yang disarankan: `/`, `/movies`, `/search?q=...`, `/movie/[id]`, `/watch/[id]`, dan `/watchlist`.

---

## 2. Wireframe per layar

### A. Homepage

```text
+------------------------------------------------+
| NOBARHUB                                       |
+------------------------------------------------+
|                                                |
|  HERO / FULL-BLEED BACKDROP SAMPAI BAWAH       |
|                                                |
|  Judul film                                    |
|  Ringkasan pendek...                           |
|  [Lihat Detail]  [▶ Tonton Trailer]            |
|                                                |
+------------------------------------------------+
| Trending Minggu Ini               [Lihat >]    |
| [Poster] [Poster] [Poster] [Poster]            |
|  Judul    Judul    Judul    Judul              |
+------------------------------------------------+
| Comedy / Drama / Genre lain                    |
| [Poster] [Poster] [Poster] [Poster]            |
+------------------------------------------------+
| [PWA Banner: Pasang NobarHub ke Layar Utama]   |
+------------------------------------------------+
| [ Beranda ] [ Cari ] [ Watchlist ] [ Profil ]  |
+------------------------------------------------+
```

**Elemen utama:**

- **Navigasi Mobile:** Bottom tab bar dan PWA install banner. Top bar hanya untuk Logo.
- **Hero trending:** backdrop besar, judul, sinopsis singkat, serta dua CTA.
- **Row film:** kartu poster horizontal untuk trending dan beberapa genre utama.
- **Kartu film:** poster, judul, tahun, rating; seluruh kartu bisa diklik.

**Interaksi:** pencarian diarahkan ke halaman hasil; CTA hero membuka Detail atau Nonton; row dapat digeser horizontal di mobile.

**State UI:**

- **Loading:** skeleton hero dan 5–6 kartu per row.
- **Error:** panel ringkas “Film gagal dimuat” dengan tombol **Coba lagi**; navbar tetap aktif.
- **Empty:** bila satu genre kosong, sembunyikan row tersebut; jangan tampilkan area kosong.

### B. Halaman katalog / pencarian

```text
+------------------------------------------------+
| NOBARHUB                                       |
+------------------------------------------------+
| Hasil untuk: "kata kunci"                      |
| [ Cari film........................ ]          |
| [Genre v] [Tahun v] [Urutkan v] [Reset]        |
+------------------------------------------------+
| [Poster]      [Poster]      [Poster]           |
| Judul         Judul         Judul              |
| 2026 | 8.1    2025 | 7.8    2024 | 7.5         |
|                                                |
| [Poster]      [Poster]      [Poster]           |
| Judul         Judul         Judul              |
+------------------------------------------------+
|             [Muat lebih banyak]                |
+------------------------------------------------+
| [PWA Banner: Pasang NobarHub ke Layar Utama]   |
+------------------------------------------------+
| [ Beranda ] [ Cari ] [ Watchlist ] [ Profil ]  |
+------------------------------------------------+
```

**Elemen utama:**

- **Judul konteks:** membedakan mode katalog dan hasil pencarian.
- **Filter:** genre dan tahun; urutan bisa memakai popularitas/rating jika waktunya cukup.
- **Grid film:** poster, judul, tahun, rating, dan aksi tambah watchlist opsional.
- **Pagination sederhana:** tombol **Muat lebih banyak** agar implementasi MVP ringan.

**State UI:**

- **Loading:** skeleton grid; filter tetap terlihat.
- **Error:** pesan “Hasil belum bisa dimuat” + **Coba lagi**.
- **Empty:** “Film tidak ditemukan” + saran hapus filter atau ubah kata kunci.
- **Filter aktif:** tampilkan chip/ringkasan filter agar mudah di-reset.

### C. Halaman detail film

```text
+------------------------------------------------+
| < Kembali                             NOBARHUB |
+------------------------------------------------+
|                       BACKDROP FILM            |
|                                                |
| [POSTER]   Judul Film (Tahun)                  |
|            ★ 8.2   2j 10m   Action, Drama      |
|            Sinopsis film dalam 2–4 baris...    |
|                                                |
|            [▶ Tonton Trailer]  [+ Watchlist]   |
+------------------------------------------------+
| Pemeran Utama                                  |
| [Foto] Nama  [Foto] Nama  [Foto] Nama          |
+------------------------------------------------+
| Film Serupa                                    |
| [Poster] [Poster] [Poster] [Poster]            |
+------------------------------------------------+
| [ Beranda ] [ Cari ] [ Watchlist ] [ Profil ]  |
+------------------------------------------------+
```

**Elemen utama:**

- **Backdrop dan poster:** identitas visual utama film.
- **Metadata:** judul, tahun, rating, durasi, dan genre.
- **Sinopsis:** cukup ringkas; boleh punya aksi “Selengkapnya” di mobile.
- **CTA:** **Tonton Trailer** dan **Tambah/Hapus Watchlist**.
- **Cast:** daftar pemeran utama secara horizontal.
- **Film serupa:** kartu menuju halaman detail film lain.

**State UI:**

- **Loading:** skeleton backdrop, poster, metadata, cast, dan film serupa.
- **Error:** pesan “Detail film gagal dimuat” + **Coba lagi** + **Kembali**.
- **Data sebagian kosong:** sembunyikan durasi/cast yang tidak tersedia, bukan menampilkan `undefined`.
- **Trailer kosong:** tombol trailer tetap terlihat tetapi disabled, dengan label **Trailer belum tersedia**.

### D. Halaman nonton

```text
+------------------------------------------------+
| < Kembali                             NOBARHUB |
+------------------------------------------------+
|                                                |
|  +------------------------------------------+  |
|  |                                          |  |
|  |         PLAYER TRAILER YOUTUBE           |  |
|  |                                          |  |
|  +------------------------------------------+  |
|                                                |
|  Judul Film (Tahun)                            |
|  ★ 8.2  |  Genre  |  Durasi                    |
|  Sinopsis singkat...                           |
|                                                |
|  [ Tonton Film Full — Segera Hadir ]           |
|  *Film penuh belum tersedia di versi MVP.      |
+------------------------------------------------+
| [ Beranda ] [ Cari ] [ Watchlist ] [ Profil ]  |
+------------------------------------------------+
```

**Elemen utama:**

- **Player:** embed trailer YouTube dengan rasio 16:9.
- **Info film:** judul, metadata singkat, dan sinopsis.
- **Tombol film penuh:** tampil seperti secondary CTA, berstatus disabled, tidak memiliki URL video atau aksi playback.
- **Pesan batasan:** menjelaskan bahwa film penuh belum tersedia tanpa memberi kesan error.

**State UI:**

- **Loading:** skeleton player 16:9 dan skeleton info film.
- **Error data:** pesan + **Coba lagi**; sediakan **Kembali ke Detail**.
- **Trailer tidak tersedia:** ganti area player dengan ikon video dan teks “Trailer belum tersedia untuk film ini”.
- **Embed gagal:** tampilkan fallback yang sama; jangan tampilkan player kosong.

### E. Halaman watchlist

```text
+------------------------------------------------+
| NOBARHUB                                       |
+------------------------------------------------+
| Watchlist Saya                6 film tersimpan |
+------------------------------------------------+
| [Poster]      [Poster]      [Poster]           |
| Judul         Judul         Judul              |
| [Hapus]       [Hapus]       [Hapus]            |
|                                                |
| [Poster]      [Poster]                         |
| Judul         Judul                            |
| [Hapus]       [Hapus]                          |
+------------------------------------------------+
| [ Beranda ] [ Cari ] [ Watchlist ] [ Profil ]  |
+------------------------------------------------+
```

**Empty state:**

```text
+------------------------------------------------------------------+
|                       Watchlist masih kosong                     |
|            Simpan film yang ingin kamu tonton nanti.             |
|                       [ Jelajahi Film ]                          |
+------------------------------------------------------------------+
```

**Elemen utama:**

- **Ringkasan:** judul halaman dan jumlah film tersimpan.
- **Grid:** kartu film dengan aksi **Hapus** yang jelas.
- **Empty state:** penjelasan singkat dan CTA kembali menjelajah.

**State UI:**

- **Memuat localStorage:** hindari flash empty state sebelum client selesai membaca data; tampilkan skeleton singkat atau render setelah mounted.
- **Empty:** tampilkan CTA **Jelajahi Film**.
- **Data rusak:** abaikan item yang tidak valid dan jangan membuat halaman crash.
- **Hapus item:** perubahan langsung terlihat dan tersimpan kembali ke `localStorage`.

---

## 3. Ringkasan state UI

| Layar | Loading | Error | Empty/fallback |
|---|---|---|---|
| Homepage | Hero + row skeleton | Retry per halaman | Sembunyikan row kosong |
| Katalog | Grid skeleton | Retry hasil | Ubah kata kunci/filter |
| Detail | Backdrop + info | Retry + kembali | Sembunyikan data kosong |
| Nonton | Player skeleton | Retry + kembali | Trailer belum tersedia |
| Watchlist | Client-load skeleton | Data invalid diabaikan | Jelajahi Film |

**Prinsip umum:**

- Skeleton mengikuti bentuk konten agar layout tidak meloncat.
- Error selalu memberi jalan keluar: **Coba lagi** atau **Kembali**.
- Empty state menjelaskan kondisi dan memberi satu CTA yang jelas.
- Tombol yang sedang memproses dibuat disabled untuk mencegah klik berulang.
- Gambar poster/backdrop gagal dimuat memakai fallback visual netral.

---

## 4. Catatan responsif

### Desktop (`>= 1024px`)

- Navbar tampil penuh dengan search lebar dan menu teks.
- Hero memakai backdrop lebar; konten teks maksimal sekitar setengah layar.
- Grid katalog/watchlist memakai 4–6 kolom, mengikuti lebar viewport.
- Detail menempatkan poster dan informasi berdampingan.
- Cast dan film serupa tampil horizontal; boleh memakai carousel.
- Player nonton dibatasi lebar maksimal agar tetap nyaman dilihat.

### Tablet (`768–1023px`)

- Grid menjadi 3–4 kolom.
- Search dapat sedikit dipendekkan.
- Poster detail tetap di samping informasi jika ruang cukup; jika sempit, turun ke layout vertikal.

### Mobile (`< 768px`)

- Navbar ringkas: logo, ikon search, dan menu/hamburger; search bisa membuka baris atau halaman terpisah.
- Hero lebih pendek dengan overlay gelap; sinopsis dipotong 2–3 baris.
- Row film horizontal dapat di-swipe.
- Grid memakai 2 kolom; jarak kartu cukup untuk sentuhan.
- Filter genre/tahun bisa berupa tombol yang membuka bottom sheet sederhana.
- Detail menjadi vertikal: backdrop, poster kecil + metadata, lalu sinopsis dan CTA.
- CTA utama di Detail dibuat full-width atau dua tombol bertumpuk.
- Player Nonton memenuhi lebar layar dan tetap 16:9.
- Tombol disabled film penuh tetap terbaca, tetapi tidak terlihat seperti fitur aktif.

---

## 5. Urutan implementasi yang disarankan

1. Buat layout global, navbar, footer, dan komponen kartu film.
2. Bangun Homepage dengan data trending dan genre dari TMDB.
3. Bangun Katalog/Pencarian beserta filter genre dan tahun.
4. Bangun Detail film, cast, video trailer, dan film serupa.
5. Bangun Halaman Nonton untuk embed trailer dan CTA film penuh non-fungsional.
6. Tambahkan Watchlist berbasis `localStorage`.
7. Rapikan loading, error, empty state, fallback gambar, dan responsif.
8. Uji alur utama dari Homepage sampai Nonton dan Watchlist sebelum deploy.

## 6. Batas wireframe MVP

Wireframe ini sengaja belum menentukan warna final, tipografi, ukuran spacing presisi, bentuk ikon, animasi, atau detail micro-interaction. Setelah struktur layar disetujui, tahap berikutnya cukup membuat mini design system: palet warna, font, tombol, kartu film, badge rating, dan aturan spacing dasar.

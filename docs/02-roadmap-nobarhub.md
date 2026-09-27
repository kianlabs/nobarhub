# Roadmap pembangunan website streaming film

## Ringkasan proyek

Membangun website katalog dan pengalaman menonton film (portofolio) dengan desain PWA mobile-first bernuansa sinematik gelap (charcoal dan emas). Metadata film berasal dari TMDB API, sedangkan konten yang diputar adalah trailer resmi melalui embed YouTube. Proyek tidak menyimpan, mengunggah, atau menayangkan film bajakan.

**Hasil akhir yang ditargetkan:** aplikasi responsif yang dapat digunakan untuk menjelajah film dan serial, mencari judul, melihat detail serta trailer, menyimpan watchlist, lalu dipamerkan melalui Vercel dan GitHub.

**Durasi realistis:** 6–8 minggu untuk solo developer dengan alokasi sekitar 10–15 jam per minggu.

**Stack utama:**

- **Frontend dan server:** Next.js + React + TypeScript
- **Styling:** Tailwind CSS atau CSS Modules
- **Data film:** TMDB API melalui server-side fetch atau Route Handler
- **Trailer:** video resmi YouTube yang tersedia pada metadata TMDB
- **State:** React Context atau Zustand bila diperlukan
- **Penyimpanan:** localStorage untuk versi awal; database untuk akun pengguna
- **Auth opsional:** Auth.js atau layanan autentikasi setara
- **Deployment:** Vercel

**Alternatif untuk bukti Laravel:** Laravel sebagai REST API, React sebagai frontend, serta MySQL atau PostgreSQL untuk pengguna dan watchlist. Pilih alternatif ini hanya jika target utama proyek memang memperkuat portofolio Laravel; jangan menjalankan dua arsitektur sekaligus.

---

## Batasan MVP

### Masuk versi pertama

- Homepage dengan hero backdrop full-bleed dan baris film per kategori
- Daftar trending, popular, dan genre
- Pencarian judul serta filter genre, tahun, dan rating
- Detail film atau serial: poster, sinopsis, rating, genre, cast, trailer, dan rekomendasi
- Watchlist
- Halaman menonton untuk trailer resmi
- Informasi season dan episode untuk serial
- Tampilan responsif, SEO dasar, loading state, dan error state

### Di luar versi pertama

- Streaming film penuh dari sumber tidak berlisensi
- Pembayaran atau langganan
- Live chat, komentar, dan ulasan pengguna
- Smart-TV app dan aplikasi mobile native
- Rekomendasi berbasis machine learning
- Multi-profile seperti layanan streaming komersial

**Prinsip scope:** selesaikan pengalaman inti dari homepage sampai trailer dapat diputar sebelum menambah autentikasi atau fitur sosial.

---

## Alur pengguna utama

1. Pengunjung membuka homepage dan melihat film trending.
2. Pengunjung menjelajah berdasarkan genre atau mencari judul.
3. Pengunjung membuka halaman detail film atau serial.
4. Pengunjung melihat cast, rekomendasi, dan memilih trailer resmi.
5. Pengunjung memutar trailer pada halaman menonton.
6. Pengunjung menyimpan judul ke watchlist.
7. Pengunjung membuka kembali watchlist di perangkat atau akun yang sama.

---

## Struktur aplikasi yang disarankan

```text
app/
  page.tsx
  search/page.tsx
  movie/[id]/page.tsx
  tv/[id]/page.tsx
  watch/[mediaType]/[id]/page.tsx
  watchlist/page.tsx
  api/
components/
  HeroBanner.tsx
  MediaRow.tsx
  MediaCard.tsx
  SearchBar.tsx
  FilterPanel.tsx
  TrailerPlayer.tsx
lib/
  tmdb.ts
  types.ts
  formatters.ts
stores/
  watchlist.ts
```

**Aturan teknis penting:** simpan token TMDB di environment variable server, jangan mengeksposkannya di repository atau memanggil API dengan token rahasia langsung dari browser.

---
## Fase 0 — Setup dan riset

**Estimasi:** 3–5 hari

### Fokus

Menetapkan scope, menyiapkan proyek, mendapatkan akses TMDB API, dan membuat dasar desain sebelum implementasi fitur.

### Checklist

- [ ] Tentukan nama proyek, logo sederhana, warna, dan tipografi
- [ ] Buat wireframe homepage, detail, pencarian, watchlist, dan halaman menonton
- [ ] Daftar dan siapkan akses TMDB API
- [ ] Inisialisasi Next.js, React, dan TypeScript
- [ ] Pasang styling serta aturan linting dan formatting
- [ ] Buat file konfigurasi environment lokal
- [ ] Susun route, komponen, dan tipe data awal
- [ ] Buat repository Git dan README awal
- [ ] Tentukan lisensi repository serta atribusi data yang diperlukan

### Kriteria selesai

- Aplikasi lokal dapat dijalankan tanpa error.
- Rahasia API hanya berada di environment lokal dan tidak masuk Git.
- Wireframe lima halaman utama tersedia.
- Scope MVP serta fitur yang ditunda telah tertulis dengan jelas.

---

## Fase 1 — Integrasi data film

**Estimasi:** 5–7 hari

### Fokus

Membangun lapisan akses data yang stabil untuk trending, popular, genre, pencarian, detail, cast, video, dan rekomendasi.

### Checklist

- [ ] Buat API client TMDB terpusat
- [ ] Definisikan tipe Movie, TVShow, Genre, Cast, Video, dan paginasi
- [ ] Ambil data trending dan popular
- [ ] Ambil daftar genre film dan serial
- [ ] Implementasikan pencarian multi-kategori
- [ ] Implementasikan detail film dan serial
- [ ] Ambil cast, video, rekomendasi, season, dan episode
- [ ] Prioritaskan trailer YouTube berjenis resmi jika tersedia
- [ ] Tambahkan penanganan request gagal, data kosong, dan rate limit
- [ ] Tambahkan caching atau revalidation sesuai karakter data
- [ ] Uji fungsi data menggunakan beberapa ID media yang valid

### Kriteria selesai

- Data dapat diambil melalui satu lapisan API client, bukan fetch tersebar.
- Semua halaman bisa menerima tipe data konsisten.
- Kegagalan jaringan dan hasil kosong tidak merusak aplikasi.
- API key atau token tidak terlihat pada kode klien maupun repository.

---

## Fase 2 — Homepage dan browsing

**Estimasi:** 5–7 hari

### Fokus

Menyelesaikan pengalaman pertama pengguna: hero, baris konten, kartu film, navigasi, pencarian, dan filter.

### Checklist

- [ ] Buat layout shell dengan bottom tab bar (mobile) dan top bar
- [ ] Buat PWA Install Banner
- [ ] Buat hero banner dari konten trending (full-bleed sampai bawah)
- [ ] Buat MediaCard yang reusable untuk film dan serial
- [ ] Buat row horizontal untuk trending, popular, dan genre pilihan
- [ ] Tambahkan skeleton loading dan fallback poster
- [ ] Buat halaman hasil pencarian
- [ ] Tambahkan filter genre, tahun, dan rating
- [ ] Sinkronkan keyword dan filter dengan URL
- [ ] Tambahkan pagination atau infinite scroll
- [ ] Pastikan keyboard navigation dan label aksesibel

### Kriteria selesai

- Pengguna dapat menjelajah dari homepage ke detail media.
- Pencarian dan filter menghasilkan URL yang dapat dibagikan.
- Loading, empty state, dan error state terlihat jelas.
- Layout nyaman dipakai pada ponsel, tablet, dan desktop.

---
## Fase 3 — Detail film dan trailer player

**Estimasi:** 5–7 hari

### Fokus

Membuat halaman detail yang informatif dan menghubungkannya dengan trailer resmi.

### Checklist

- [ ] Buat route detail terpisah untuk film dan serial
- [ ] Tampilkan backdrop, poster, judul, sinopsis, rating, tanggal, dan genre
- [ ] Tampilkan pemeran utama dan informasi tambahan
- [ ] Tampilkan rekomendasi atau judul serupa
- [ ] Pilih trailer resmi dengan fallback video yang relevan
- [ ] Buat TrailerPlayer dengan embed YouTube yang responsif
- [ ] Sediakan empty state jika trailer tidak tersedia
- [ ] Tambahkan breadcrumb atau tombol kembali
- [ ] Buat metadata dinamis untuk judul dan deskripsi halaman
- [ ] Pastikan ID serta tipe media divalidasi

### Kriteria selesai

- Detail film dan serial ditampilkan melalui route yang benar.
- Trailer resmi dapat diputar tanpa meninggalkan aplikasi.
- Media tanpa poster, cast, rekomendasi, atau trailer tetap memiliki tampilan layak.
- Metadata halaman berubah mengikuti judul yang dibuka.

---

## Fase 4 — Watchlist dan autentikasi sederhana

**Estimasi:** 5–8 hari

### Fokus

Memberikan fitur personalisasi tanpa memperbesar scope terlalu cepat.

### Urutan implementasi

1. Mulai dengan localStorage agar alur watchlist segera berfungsi.
2. Tambahkan login hanya setelah seluruh alur inti stabil.
3. Jika autentikasi dipakai, pindahkan watchlist ke database dan sinkronkan data lokal setelah pengguna masuk.

### Checklist

- [ ] Tambahkan tombol simpan atau hapus pada kartu dan halaman detail
- [ ] Simpan ID, tipe media, judul, poster, dan waktu penyimpanan
- [ ] Buat halaman watchlist dengan empty state
- [ ] Pertahankan watchlist setelah refresh
- [ ] Hindari item duplikat
- [ ] Tambahkan notifikasi singkat saat status berubah
- [ ] Putuskan apakah login masuk scope rilis pertama
- [ ] Jika ya, implementasikan login dan logout
- [ ] Jika ya, buat tabel user dan watchlist
- [ ] Jika ya, lindungi endpoint serta validasi kepemilikan data

### Kriteria selesai

- Watchlist dapat ditambah, dilihat, dan dihapus dengan konsisten.
- Data tidak hilang setelah refresh pada mode localStorage.
- Bila login dipakai, satu pengguna tidak dapat membaca watchlist pengguna lain.
- Pengalaman tanpa login tetap dapat dipahami.

---

## Fase 5 — Halaman menonton dan serial

**Estimasi:** 5–7 hari

### Fokus

Membuat halaman menonton yang terasa seperti produk streaming, tetapi hanya memutar trailer resmi.

### Checklist

- [ ] Buat route halaman menonton untuk film dan serial
- [ ] Tampilkan player besar yang responsif
- [ ] Tampilkan judul, sinopsis singkat, genre, dan rating
- [ ] Sediakan daftar trailer atau video resmi lain bila tersedia
- [ ] Buat pemilih season untuk serial
- [ ] Tampilkan daftar episode, nomor, judul, gambar, durasi, dan ringkasan bila tersedia
- [ ] Bedakan episode informatif dari video yang benar-benar dapat diputar
- [ ] Tampilkan pesan jelas jika video resmi tidak tersedia
- [ ] Tambahkan rekomendasi untuk tontonan berikutnya
- [ ] Pastikan player dan kontrol dapat dioperasikan dengan keyboard

### Kriteria selesai

- Trailer dapat diputar dari detail maupun halaman menonton.
- Pengguna dapat berpindah season dan melihat daftar episode.
- UI tidak mengesankan bahwa episode penuh tersedia jika sumbernya hanya metadata.
- Tidak ada video yang berasal dari sumber tidak berlisensi.

---

## Fase 6 — Polish, pengujian, dan rilis

**Estimasi:** 7–10 hari

### Fokus

Meningkatkan kualitas produk, mendokumentasikan keputusan teknis, lalu merilisnya sebagai portofolio.

### Checklist kualitas

- [ ] Perbaiki semua layout untuk ponsel, tablet, dan desktop
- [ ] Optimalkan gambar dengan komponen image bawaan Next.js
- [ ] Kurangi layout shift dan request yang tidak perlu
- [ ] Tambahkan SEO dasar, sitemap, robots, dan Open Graph
- [ ] Tambahkan halaman not-found dan error boundary
- [ ] Audit aksesibilitas dasar: fokus, kontras, label, dan alt text
- [ ] Uji alur homepage sampai trailer diputar
- [ ] Uji pencarian, filter, watchlist, film, dan serial
- [ ] Uji kondisi API gagal, data kosong, dan trailer tidak tersedia
- [ ] Pastikan tidak ada secret, log debug, atau data sensitif di Git

### Checklist portofolio

- [ ] Deploy production ke Vercel
- [ ] Konfigurasikan environment variable pada deployment
- [ ] Tambahkan screenshot atau GIF demo ke README
- [ ] Jelaskan masalah, solusi, arsitektur, fitur, dan keputusan scope
- [ ] Cantumkan cara menjalankan proyek secara lokal
- [ ] Cantumkan atribusi TMDB dan kebijakan penggunaan trailer resmi
- [ ] Tulis tantangan teknis serta hal yang dipelajari
- [ ] Rapikan commit history dan issue yang relevan
- [ ] Pin repository pada profil GitHub
- [ ] Tambahkan proyek ke CV, LinkedIn, dan portfolio website

### Kriteria selesai

- URL production dapat dibuka dan alur utama berjalan.
- Tidak ada secret pada repository atau bundle klien.
- README cukup jelas untuk membantu recruiter memahami kontribusi teknis.
- Lighthouse dan audit manual tidak menemukan masalah kritis pada aksesibilitas, performa, atau SEO.

---
## Papan progres

Perbarui status menjadi **Belum mulai**, **Dikerjakan**, **Terhambat**, atau **Selesai**. Isi progres berdasarkan kriteria selesai, bukan hanya jumlah checklist.

| Fase | Durasi | Status | Progres |
|---|---:|---|---:|
| 0. Setup dan riset | 3–5 hari | Belum mulai | 0% |
| 1. Integrasi data | 5–7 hari | Belum mulai | 0% |
| 2. Homepage | 5–7 hari | Belum mulai | 0% |
| 3. Detail dan trailer | 5–7 hari | Belum mulai | 0% |
| 4. Watchlist dan auth | 5–8 hari | Belum mulai | 0% |
| 5. Watch dan series | 5–7 hari | Belum mulai | 0% |
| 6. Polish dan rilis | 7–10 hari | Belum mulai | 0% |

### Catatan sprint

Gunakan format berikut setiap akhir sesi kerja:

- **Tanggal:**
- **Fase aktif:**
- **Yang selesai:**
- **Hambatan:**
- **Langkah berikutnya:**

---

## Jadwal mingguan yang disarankan

| Minggu | Target utama | Hasil akhir |
|---|---|---|
| 1 | Setup dan data | API client stabil |
| 2 | Homepage | Browsing berfungsi |
| 3 | Search dan detail | Detail lengkap |
| 4 | Trailer dan watchlist | Alur inti selesai |
| 5 | Series dan watch | Season tampil |
| 6 | Polish dan tes | Siap produksi |
| 7–8 | Buffer dan portofolio | Rilis publik |

**Catatan:** autentikasi adalah kandidat pertama yang ditunda bila jadwal meleset. Watchlist localStorage sudah cukup untuk menunjukkan state management pada versi portofolio awal.

---

## Strategi pengujian minimum

### Unit test

- Formatter tanggal, rating, durasi, dan URL gambar
- Seleksi trailer resmi dan fallback
- Operasi tambah, hapus, dan deduplikasi watchlist
- Transformasi response TMDB menjadi tipe aplikasi

### Integration test

- API client menangani response berhasil, kosong, dan gagal
- Search dan filter memperbarui hasil serta URL
- Halaman detail memuat data utama dan rekomendasi
- Watchlist tetap konsisten setelah reload

### End-to-end test

- Homepage --> detail --> trailer
- Search --> filter --> detail
- Detail --> tambah watchlist --> hapus
- Serial --> pilih season --> lihat episode

---

## Risiko dan cara mengendalikannya

- **Scope melebar:** kunci fitur MVP dan pindahkan fitur tambahan ke daftar pengembangan berikutnya.
- **API limit atau gangguan:** gunakan caching, revalidation, loading state, dan error state.
- **Desain terlalu meniru produk streaming lain:** gunakan pola browsing yang familiar, tetapi bangun identitas visual dan komponen sendiri dengan aksen emas.
- **Auth memakan waktu:** rilis watchlist localStorage lebih dulu.
- **Data film tidak lengkap:** siapkan fallback untuk gambar, deskripsi, cast, dan tanggal.

---

## Definisi proyek selesai

Proyek dinyatakan siap dipamerkan ketika:

- [ ] Semua alur utama dapat digunakan pada URL production
- [ ] Homepage, search, filter, detail, trailer, watchlist, dan series berfungsi
- [ ] Hanya trailer atau video resmi yang diputar
- [ ] Tampilan responsif dan aksesibel secara dasar
- [ ] Error state dan empty state tersedia
- [ ] Tidak ada secret dalam repository
- [ ] README menjelaskan arsitektur serta keputusan teknis
- [ ] Repository publik dan deployment sudah ditautkan di portfolio
- [ ] Ada screenshot atau demo singkat
- [ ] Recruiter dapat memahami nilai proyek dalam waktu kurang dari dua menit

---

## Narasi untuk portfolio

> Membangun platform katalog film dan serial menggunakan Next.js, React, dan TMDB API. Aplikasi menyediakan browsing berbasis genre, pencarian dan filter, detail media, trailer resmi YouTube, daftar season dan episode, serta watchlist. Fokus teknis mencakup server-side data fetching, dynamic routing, caching, state management, responsive UI, SEO, aksesibilitas, dan penanganan kondisi API gagal.

**Bukti kemampuan yang ditonjolkan:** integrasi API, desain komponen reusable, pemodelan data TypeScript, routing dinamis, state management, keamanan secret, performa frontend, deployment, dan dokumentasi teknis.

## Pengembangan setelah MVP

Urutan yang disarankan setelah rilis pertama:

1. Watchlist berbasis akun dan database
2. Riwayat trailer yang telah ditonton
3. Personalisasi berdasarkan genre favorit
4. Progressive Web App
5. Test coverage yang lebih luas
6. Backend Laravel terpisah bila dibutuhkan sebagai studi arsitektur atau bukti Laravel

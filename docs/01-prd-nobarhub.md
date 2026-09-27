# PRD ringan — Website streaming film

> Template praktis untuk solo developer. Isi bagian dalam tanda `[ ... ]`, lalu centang keputusan yang sudah final.

## 1. Informasi dasar

| Item | Isi |
|---|---|
| Nama proyek | NobarHub |
| Pemilik | Ridzkyan Buti Pratama (Kyan) |
| Tanggal dibuat | 27 Sep 2026 |
| Versi PRD | v0.1 |
| Status | Final |
| Target rilis MVP | 4 Okt 2026 |

- [x] Nama proyek sudah final
- [x] Target rilis masuk akal
- [x] PRD sudah dikunci untuk MVP

---

## 2. Latar belakang dan masalah

**Latar belakang**  
NobarHub adalah proyek portofolio untuk menunjukkan kemampuan membangun aplikasi web modern dengan Next.js + React dan integrasi API pihak ketiga (TMDB).

**Masalah utama**  
Pengguna kesulitan menemukan informasi film dan trailer resmi dalam satu pengalaman yang cepat, rapi, dan responsif.

**Solusi yang ditawarkan**  
NobarHub menyatukan katalog film, pencarian dan filter, detail lengkap (sinopsis, cast, rating), serta trailer resmi YouTube dalam satu web yang cepat dan responsif.

- [x] Masalah dapat dijelaskan dalam 1–2 kalimat
- [x] Solusi tidak menjanjikan streaming film penuh
- [x] Nilai pembeda produk sudah jelas

---

## 3. Target user

**Pengguna utama**  
Penonton film usia 18–35 tahun yang mencari tontonan dan ingin menonton trailer resmi sebelum memilih film.

**Kebutuhan utama**

- Mencari film dengan cepat berdasarkan judul, genre, atau tahun
- Melihat info lengkap dan trailer resmi di satu tempat
- Menyimpan film yang menarik ke watchlist

**Perangkat utama**  
Keduanya — mobile dan desktop

- [x] Target user cukup spesifik
- [x] Kebutuhan user sesuai dengan fitur MVP

---

## 4. Tujuan proyek

### Tujuan produk

1. Pengguna bisa menemukan film dan menonton trailer resminya dalam waktu kurang dari 1 menit dari homepage.
2. MVP rilis 4 Okt 2026 dengan semua fitur P0 berjalan tanpa error utama.
3. Website fully responsif dan live di URL publik.

### Tujuan portofolio

Proyek ini harus menunjukkan kemampuan berikut kepada recruiter:

- [x] Membangun aplikasi dengan Next.js dan React
- [x] Mengintegrasikan dan mengolah data TMDB API
- [x] Mengelola loading, error, dan empty state
- [x] Membuat UI responsif dan reusable component
- [x] Mengimplementasikan pencarian dan filter
- [x] Mengoptimalkan performa gambar dan halaman
- [x] Menulis struktur kode dan dokumentasi yang rapi

**Indikator keberhasilan portofolio**  
Aplikasi live di URL publik, README lengkap, responsif di mobile dan desktop, tidak ada error utama, dan recruiter memahami produk dalam 3 menit tanpa penjelasan langsung.

---

## 5. Ruang lingkup fitur

### MVP — wajib rilis

| Fitur | Hasil utama | Prioritas | Selesai |
|---|---|---|---|
| Beranda | Film trending | P0 | [ ] |
| Katalog | Daftar film | P0 | [ ] |
| Pencarian | Cari judul | P0 | [ ] |
| Filter | Genre / tahun | P1 | [ ] |
| Detail film | Info dan cast | P0 | [ ] |
| Trailer resmi | Embed YouTube | P0 | [ ] |
| Placeholder 'Tonton Film Full' | Tombol/banner 'Segera Hadir' yang terlihat di halaman Nonton (non-fungsional untuk sekarang); video source dirancang mudah diganti ke film berlisensi | P1 | [ ] |
| Film serupa | Rekomendasi | P1 | [ ] |
| Watchlist lokal | Simpan pilihan | P1 | [ ] |
| State UI | Loading / error | P0 | [ ] |
| Responsif | Mobile–desktop | P0 | [ ] |
| `[Fitur lain]` | `[Hasil]` | `[P0/P1]` | [ ] |

**Aturan prioritas:** P0 harus ada agar produk layak rilis; P1 penting tetapi dapat dipangkas jika waktu sempit.

### Fase lanjutan — nanti

| Fitur | Nilai tambah | Prioritas | Dipilih |
|---|---|---|---|
| Login pengguna | Sinkron akun | P2 | [ ] |
| Watchlist cloud | Lintas perangkat | P2 | [ ] |
| Ulasan pengguna | Interaksi | P3 | [ ] |
| Mode gelap | Preferensi UI | P3 | [ ] |
| TV series | Episode / musim | P2 | [ ] |
| Multi-bahasa | Akses lebih luas | P3 | [ ] |
| Nonton film full (placeholder) | Halaman Nonton sudah ada sejak MVP dengan sumber video yang mudah diganti; saat ini memutar trailer resmi, siap diganti ke film berlisensi jika lisensi diperoleh | P2 | [ ] |
| `[Fitur lain]` | `[Nilai tambah]` | `[P2/P3]` | [ ] |

**Di luar scope MVP**  
`[Tuliskan hal yang sengaja tidak dikerjakan, misalnya hosting video penuh, pembayaran, panel admin kompleks, atau fitur sosial.]`

Catatan: halaman Nonton dibangun sejak MVP sebagai placeholder — video source-nya trailer resmi YouTube, dirancang agar mudah diganti ke sumber film berlisensi di masa depan.

---

## 6. Alur pengguna ringkas

### Alur utama

**Homepage** --> **Detail film** --> **Nonton trailer** --> **Tambah ke watchlist**

1. Pengguna membuka homepage dan melihat film populer atau trending.
2. Pengguna mencari atau memilih film dari katalog.
3. Pengguna membuka detail untuk melihat sinopsis, rating, genre, cast, dan rekomendasi.
4. Pengguna membuka halaman nonton untuk memutar trailer resmi YouTube.
5. Pengguna menambah atau menghapus film dari watchlist.

### Kondisi khusus

- [x] Data sedang dimuat: tampilkan skeleton atau indikator loading
- [x] API gagal: tampilkan pesan error dan tombol coba lagi
- [x] Hasil pencarian kosong: tampilkan empty state yang jelas
- [x] Trailer tidak tersedia: tampilkan informasi tanpa player rusak
- [x] Tombol 'Tonton Film Full' berstatus placeholder: tampil sebagai 'Segera Hadir' dan tidak memutar apa pun sampai sumber berlisensi tersedia
- [x] Watchlist kosong: tampilkan ajakan menambahkan film

---

## 7. Kebutuhan teknis

| Area | Keputusan |
|---|---|
| Framework | Next.js + React |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| Data film | TMDB API |
| Video | Embed YouTube resmi |
| Watchlist | localStorage (tanpa backend untuk MVP) |
| Deployment | Vercel |
| Testing | Manual untuk MVP |

### Ketentuan implementasi

- [x] API key tidak diekspos di kode client atau repository
- [x] Semua request memiliki loading, error, dan empty state
- [x] Komponen utama dapat digunakan ulang
- [x] Gambar memakai fallback saat poster tidak tersedia
- [x] Layout nyaman dipakai di mobile dan desktop
- [x] Metadata halaman detail mendukung SEO dasar
- [x] Repository memiliki README dan petunjuk instalasi

### Batasan konten

- [x] Tidak mengunggah atau menyediakan film bajakan
- [x] Tidak menyediakan tautan streaming ilegal
- [x] Halaman nonton hanya memutar trailer resmi melalui embed YouTube
- [x] Penggunaan data dan aset mengikuti ketentuan penyedia API

---

## 8. Kriteria selesai

| Fitur | Definisi done | Lulus |
|---|---|---|
| Homepage | Data tampil stabil | [x] |
| Pencarian | Hasil sesuai kata | [x] |
| Filter | Daftar ikut berubah | [x] |
| Detail | Info inti lengkap | [x] |
| Trailer | Embed dapat diputar | [x] |
| Watchlist | Tetap setelah refresh | [x] |
| State UI | Semua kondisi ada | [x] |
| Responsif | 3 ukuran layar | [x] |
| Deploy | URL publik aktif | [x] |
| Dokumentasi | Setup dapat diikuti | [x] |

**Standar rilis umum**

- [x] Tidak ada error utama di console
- [x] Navigasi utama tidak menghasilkan halaman buntu
- [x] Tidak ada data rahasia di repository
- [x] Akses keyboard dan label elemen penting diperiksa
- [x] Tampilan diuji pada mobile, tablet, dan desktop
- [x] Recruiter dapat memahami produk tanpa penjelasan langsung

---

## 9. Asumsi, batasan, dan risiko

### Asumsi

- TMDB API (free tier) tersedia dan kuotanya mencukupi selama pengembangan dan demo.
- Trailer resmi tersedia di YouTube untuk mayoritas film populer.

### Batasan

- **Waktu:** 12 jam per hari, 27 Sep – 4 Okt 2026 (1 minggu)
- **Anggaran:** Gratis — TMDB free tier + Vercel free tier
- **Cakupan:** Film saja; TV series di fase lanjutan
- **Wilayah/bahasa:** Indonesia, Bahasa Indonesia

### Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| API gagal | Data tidak tampil | Error + retry |
| Limit API | Request tertolak | Cache + batasi |
| Trailer kosong | Player kosong | Empty state |
| Scope melebar | Rilis terlambat | Bekukan MVP |
| Kinerja lambat | UX menurun | Optimasi gambar |
| `[Risiko lain]` | `[Dampak]` | `[Mitigasi]` |

---

## 10. Estimasi timeline

| Fase | Fokus | Estimasi | Selesai |
|---|---|---:|---|
| 1 | PRD dan scope | hari ini (selesai) | [x] |
| 2 | Flow dan wireframe | 0,5 hari | [ ] |
| 3 | UI system mini | 0,5 hari | [ ] |
| 4 | Setup dan API | 1 hari | [ ] |
| 5 | Fitur inti MVP | 2–3 hari | [ ] |
| 6 | Watchlist dan polish | 1 hari | [ ] |
| 7 | Testing dan deploy | 1 hari | [ ] |
| 8 | README dan demo | 0,5 hari | [ ] |

**Waktu kerja tersedia**  
12 jam per hari, 27 Sep – 4 Okt 2026

**Buffer risiko**  
15–20% dari estimasi; jika waktu habis, fitur P1 dipindah ke fase lanjutan.

**Keputusan rilis:** Jika waktu habis, fitur P1 dipindahkan ke fase lanjutan; fitur P0 tetap wajib selesai.

---

## Ringkasan satu kalimat

NobarHub membantu penonton film untuk menemukan film dan menonton trailer resmi dengan cepat melalui katalog dan player yang responsif, sekaligus menunjukkan kemampuan saya dalam Next.js, integrasi API, dan UI/UX modern.

### Persetujuan scope MVP

- [x] Masalah, target user, dan tujuan sudah jelas
- [x] Semua fitur P0 memiliki definisi done
- [x] Fitur fase lanjutan tidak ikut dikerjakan sebelum MVP rilis
- [x] Timeline sesuai waktu kerja yang tersedia
- [x] Siap masuk ke user flow dan wireframe

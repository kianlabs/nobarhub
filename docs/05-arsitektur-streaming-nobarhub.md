# Rancangan arsitektur streaming NobarHub

**Stack aplikasi:** Next.js + TypeScript  
**Status saat ini:** halaman Nonton memakai embed trailer YouTube sebagai sumber sementara  
**Tujuan:** menyiapkan fondasi agar NobarHub dapat memutar film penuh yang hak tayangnya dimiliki atau diizinkan secara sah

> **Batas penggunaan:** rancangan ini hanya untuk konten legal/berlisensi, seperti film indie dengan izin tertulis, film penuh resmi yang memang boleh di-embed dari YouTube, atau katalog yang diperoleh melalui perjanjian lisensi. Arsitektur ini tidak ditujukan untuk mengambil, mem-proxy, melakukan scraping, atau menayangkan ulang film dari situs tanpa izin.

## 1. Ringkasan keputusan

Untuk NobarHub, gunakan satu komponen UI `MoviePlayer` dengan beberapa adapter sumber video. Saat ini adapter yang aktif adalah `YouTubeSource`. Ketika konten berlisensi tersedia, tambahkan `HlsSource` tanpa mengubah layout halaman Nonton.

Urutan yang disarankan:

1. **Tahap A:** embed YouTube legal; tidak menyimpan file film.
2. **Tahap B:** satu atau beberapa film berizin di object storage, ditranscode menjadi HLS 360p/720p/1080p dengan FFmpeg, lalu diputar menggunakan hls.js.
3. **Tahap C:** distribusi lewat CDN, akses melalui signed URL atau signed cookie, dan DRM bila diwajibkan pemilik konten.

Pilihan awal paling masuk akal adalah **HLS + hls.js**. Shaka Player baru diprioritaskan ketika NobarHub membutuhkan DASH atau DRM lintas browser. Video.js cocok bila ingin paket UI player siap pakai, tetapi tidak wajib untuk MVP.

---

## 2. Cara kerja streaming modern

File master tidak dikirim langsung sebagai satu file MP4 besar. Sistem mengubahnya menjadi beberapa kualitas dan memecah setiap kualitas menjadi segmen pendek. Player memilih segmen yang paling sesuai dengan bandwidth pengguna.

```text
Pemilik konten
      |
      | upload file master + bukti izin
      v
Object storage privat
      |
      | job transcoding
      v
FFmpeg / transcoder
      |
      +--> 360p playlist + segments
      +--> 720p playlist + segments
      +--> 1080p playlist + segments
      +--> subtitle WebVTT
      |
      v
Master manifest HLS (.m3u8)
      |
      | origin privat
      v
CDN + kontrol akses
      |
      | HTTPS, signed URL/cookie
      v
MoviePlayer di Next.js
      |
      +--> pilih kualitas otomatis
      +--> subtitle
      +--> simpan progres menonton
```

### Alur setiap tahap

1. **Upload:** admin mengunggah file master berkualitas tinggi ke bucket privat. File ini bukan URL publik.
2. **Validasi:** sistem memeriksa format, durasi, audio, subtitle, dan status hak tayang.
3. **Transcoding:** FFmpeg membuat beberapa rendition dengan resolusi dan bitrate berbeda.
4. **Packaging:** hasil encoding dipecah menjadi segmen HLS dan disatukan melalui master playlist `.m3u8`.
5. **Distribusi:** CDN mengambil segmen dari object storage dan menyimpannya sementara di edge cache.
6. **Playback adaptif:** player menaikkan atau menurunkan kualitas berdasarkan bandwidth, buffer, dan kemampuan perangkat.
7. **Progres:** posisi terakhir dikirim ke backend secara berkala agar fitur resume watching bekerja lintas perangkat.

**HLS vs DASH:** keduanya mendukung adaptive bitrate. Untuk fase awal, HLS lebih sederhana dan punya jalur playback native di Safari; browser lain dapat memakai hls.js. DASH menjadi relevan saat kebutuhan perangkat atau DRM membuat Shaka Player lebih cocok.

---

## 3. Komponen arsitektur

### 3.1 Object storage

Gunakan object storage sebagai tempat file master dan hasil transcoding.

**Struktur yang disarankan:**

```text
media/
  movies/{movieId}/
    master/source.mp4
    hls/master.m3u8
    hls/360p/index.m3u8
    hls/720p/index.m3u8
    hls/1080p/index.m3u8
    hls/360p/segment-0001.ts
    subtitles/id.vtt
    subtitles/en.vtt
    poster/poster.webp
```

**Aturan penting:**

- Bucket master dan HLS bersifat privat.
- Akses publik hanya melalui CDN dan token sementara.
- Pisahkan file master dari file distribusi agar kebijakan retensi berbeda.
- Simpan checksum, durasi, codec, ukuran, dan status transcoding di database.
- Aktifkan lifecycle policy untuk menghapus output job gagal atau versi lama.

### 3.2 Transcoding dengan FFmpeg

Profil awal cukup tiga rendition. Angka bitrate di bawah adalah titik awal, bukan nilai mutlak; sesuaikan dengan kualitas master, frame rate, genre, dan hasil pengujian visual.

| Profil | Resolusi | Video | Audio |
|---|---:|---:|---:|
| Rendah | 640x360 | 0,6–0,9 Mbps | 96 kbps |
| Menengah | 1280x720 | 2–3 Mbps | 128 kbps |
| Tinggi | 1920x1080 | 4,5–6 Mbps | 160 kbps |

Gunakan H.264 untuk kompatibilitas awal, AAC untuk audio, keyframe yang sejajar antar-rendition, playlist VOD, dan segmen sekitar 4–6 detik. Output harus memiliki master playlist yang mereferensikan seluruh kualitas.

**Pipeline job:**

```text
UPLOADED --> VALIDATING --> TRANSCODING --> PACKAGING
         --> READY
         --> FAILED (log + retry terbatas)
```

FFmpeg sebaiknya dijalankan sebagai worker terpisah, bukan di fungsi request Next.js. Transcoding memerlukan CPU tinggi, bisa berlangsung lama, dan harus dapat di-retry tanpa menggandakan hasil.

### 3.3 CDN

CDN melayani manifest dan segmen dari lokasi yang dekat dengan pengguna. Manfaat utamanya adalah mengurangi beban origin, mempercepat startup, dan menahan lonjakan trafik.

**Konfigurasi minimum:**

- Origin hanya menerima permintaan dari CDN bila penyedia mendukungnya.
- HTTPS wajib.
- Cache segmen lebih lama; cache manifest dan token lebih singkat.
- CORS hanya mengizinkan domain NobarHub.
- Gunakan versioned path agar pembaruan film tidak berbenturan dengan cache lama.
- Pantau cache hit ratio, bandwidth keluar, error 4xx/5xx, startup time, dan buffering.

### 3.4 Video player

| Opsi | Cocok untuk | Catatan |
|---|---|---|
| hls.js | HLS non-DRM awal | Ringan, kontrol dekat HTML5 |
| Shaka Player | HLS/DASH + DRM | Lebih lengkap untuk EME |
| Video.js | UI siap pakai | Ekosistem plugin besar |

**Rekomendasi NobarHub:**

- Tahap A: komponen embed YouTube sendiri.
- Tahap B: elemen `<video>` + hls.js, dengan native HLS fallback bila browser mendukungnya.
- Tahap C: evaluasi Shaka Player apabila lisensi mewajibkan Widevine/FairPlay atau katalog membutuhkan DASH.

**Fitur player minimum:**

- kualitas otomatis sebagai default;
- pemilihan kualitas manual;
- subtitle Indonesia/Inggris dalam WebVTT;
- resume watching;
- loading, retry, dan pesan error yang jelas;
- kontrol keyboard dan label aksesibilitas;
- poster, durasi, fullscreen, serta Picture-in-Picture bila didukung.

**Resume watching:** simpan `positionSeconds`, `durationSeconds`, dan `updatedAt`. Kirim progres setiap 15–30 detik, saat pause, dan saat halaman ditutup. Jangan menulis database pada setiap event `timeupdate`. Tandai selesai ketika posisi mencapai sekitar 90–95% durasi.

---

## 4. Backend, metadata, dan kontrol akses

### 4.1 Layanan backend

Next.js Route Handlers dapat melayani API MVP. Worker transcoding sebaiknya tetap terpisah.

```text
Next.js web
  |
  +--> Catalog API --> database metadata
  +--> Playback API --> cek akses --> signed URL/cookie
  +--> Progress API --> resume watching
  +--> Admin API --> upload + status job
                               |
                               v
                         job queue
                               |
                               v
                        FFmpeg worker
```

### 4.2 Endpoint konseptual

- `GET /api/movies/:id`: metadata publik film.
- `POST /api/movies/:id/playback`: memeriksa login, wilayah, lisensi, dan hak akses; mengembalikan konfigurasi player sementara.
- `PUT /api/movies/:id/progress`: menyimpan posisi terakhir.
- `POST /api/admin/movies/:id/upload`: membuat URL upload privat untuk admin.
- `GET /api/admin/jobs/:id`: membaca status transcoding.

Contoh respons playback:

```json
{
  "source": {
    "kind": "hls",
    "manifestUrl": "<signed-manifest-url>",
    "expiresAt": "<ISO-8601>"
  },
  "subtitles": [
    { "lang": "id", "label": "Indonesia", "url": "<signed-vtt-url>" }
  ],
  "resumeAtSeconds": 842,
  "entitlement": { "canPlay": true }
}
```

URL di atas adalah bentuk data, bukan alamat nyata. Jangan menyimpan URL bertanda tangan secara permanen di database atau source code.

### 4.3 Metadata minimum

**Film:** `id`, judul, slug, sinopsis, poster, durasi, tahun, rating usia, wilayah tayang, awal/akhir lisensi, status publikasi.  
**Asset:** `movieId`, jenis sumber, object key, codec, resolusi, bitrate, status job.  
**Subtitle:** bahasa, label, object key, format, status.  
**Entitlement:** pengguna/paket, film, wilayah, waktu berlaku.  
**Progress:** pengguna, film, posisi, durasi, waktu pembaruan.

### 4.4 Signed URL atau signed cookie

Alur akses:

1. Player meminta sesi playback ke backend.
2. Backend memverifikasi pengguna dan hak tayang.
3. Backend menerbitkan URL atau cookie yang kedaluwarsa singkat.
4. CDN memvalidasi tanda tangan sebelum mengirim manifest/segmen.
5. Player meminta token baru sebelum kedaluwarsa jika sesi masih sah.

Untuk HLS yang memiliki ratusan segmen, signed cookie sering lebih nyaman karena satu otorisasi dapat berlaku untuk seluruh path film. Jika memakai signed URL per objek, pastikan seluruh manifest dan segmen menerima akses yang konsisten.

**Signed URL bukan DRM.** Ia mencegah hotlink dan membatasi masa berlaku, tetapi pengguna yang sah tetap menerima data video pada perangkatnya.

### 4.5 DRM opsional

DRM diperlukan bila kontrak pemilik konten mensyaratkannya, katalog bernilai tinggi, atau NobarHub melayani transaksi berbayar dengan persyaratan proteksi kuat.

- **Widevine:** umum untuk Chrome, Android, dan banyak perangkat non-Apple.
- **FairPlay:** diperlukan pada ekosistem Apple/Safari ketika diminta oleh skema distribusi.
- **PlayReady:** mungkin diperlukan untuk sebagian perangkat Windows/TV.

DRM menambah packaging terenkripsi, key management, license server, konfigurasi player, sertifikat, biaya, serta pengujian lintas perangkat. Jangan memasangnya di tahap awal hanya untuk terlihat canggih. Mulai ketika persyaratan lisensi tertulis benar-benar memintanya.

---

## 5. Abstraksi sumber video di codebase

Tujuannya adalah memisahkan **tampilan player** dari **cara video diperoleh**. Halaman Nonton hanya menerima objek `VideoSource`; adapter yang berbeda menangani YouTube, HLS, atau DASH.

### 5.1 Kontrak TypeScript

```ts
type SubtitleTrack = {
  lang: "id" | "en" | string;
  label: string;
  url: string;
  default?: boolean;
};

type VideoSource =
  | {
      kind: "youtube";
      videoId: string;
      contentType: "trailer" | "full-movie";
    }
  | {
      kind: "hls";
      manifestUrl: string;
      expiresAt?: string;
      subtitles?: SubtitleTrack[];
      drm?: DrmConfig;
    }
  | {
      kind: "dash";
      manifestUrl: string;
      expiresAt?: string;
      subtitles?: SubtitleTrack[];
      drm?: DrmConfig;
    };

type MoviePlayerProps = {
  movieId: string;
  source: VideoSource;
  posterUrl?: string;
  resumeAtSeconds?: number;
  onProgress?: (seconds: number) => void;
  onEnded?: () => void;
};
```

`DrmConfig` hanya menyimpan konfigurasi non-rahasia yang dibutuhkan client, seperti URL license server dan nama key system. Kunci enkripsi, secret penandatanganan, serta kredensial penyedia tidak boleh masuk bundle browser.

### 5.2 Komposisi komponen

```text
app/watch/[movieId]/page.tsx
  |
  +--> getPlaybackConfig(movieId)
  |
  +--> <MoviePlayer source={source} ... />
          |
          +--> youtube --> <YouTubeAdapter />
          +--> hls     --> <HlsAdapter />
          +--> dash    --> <ShakaAdapter />
```

Contoh dispatcher konseptual:

```tsx
export function MoviePlayer(props: MoviePlayerProps) {
  switch (props.source.kind) {
    case "youtube":
      return <YouTubeAdapter {...props} source={props.source} />;
    case "hls":
      return <HlsAdapter {...props} source={props.source} />;
    case "dash":
      return <ShakaAdapter {...props} source={props.source} />;
  }
}
```

**Aturan desain:**

- `MoviePlayer` memiliki shell UI yang sama: judul, poster, loading, error, kontrol, dan status progres.
- Adapter hanya mengurus SDK/player engine dan event normalisasi.
- API playback menentukan sumber aktif; halaman tidak menebak URL.
- Katalog TMDB tetap diperlakukan sebagai metadata, bukan bukti hak streaming.
- Field `contentType` membedakan trailer dengan film penuh resmi agar label UI tidak menyesatkan.

### 5.3 Bentuk data sementara

Untuk fase saat ini, metadata film dapat memiliki konfigurasi:

```ts
const source: VideoSource = {
  kind: "youtube",
  videoId: "<official-video-id>",
  contentType: "trailer"
};
```

Ketika film berlisensi siap, API mengembalikan:

```ts
const source: VideoSource = {
  kind: "hls",
  manifestUrl: "<temporary-signed-url>",
  expiresAt: "<ISO-8601>",
  subtitles: [{ lang: "id", label: "Indonesia", url: "<signed-vtt-url>" }]
};
```

Layout halaman tidak berubah; hanya nilai `source` dan adapter yang dipakai.

---

## 6. Tahapan implementasi

### Tahap A — Embed legal YouTube

**Tujuan:** menyelesaikan MVP katalog dan pengalaman halaman Nonton tanpa infrastruktur video sendiri.

- Pastikan video berasal dari kanal resmi dan pemilik mengizinkan embed.
- Pakai `YouTubeSource` dan label yang benar: “Trailer” atau “Film penuh resmi”.
- Tambahkan state unavailable bila video dihapus, dibatasi wilayah, atau embed dinonaktifkan.
- Simpan progress lokal hanya bila bermanfaat; sinkronisasi akun dapat menunggu.
- Jangan menampilkan tombol “Tonton film penuh” jika sumber hanya trailer.

**Selesai ketika:** player responsif, fallback jelas, tidak ada URL bajakan, dan UI sudah memakai kontrak `VideoSource`.

### Tahap B — Self-host HLS sederhana

**Tujuan:** membuktikan pipeline end-to-end dengan satu film berizin.

- Bucket privat untuk master dan HLS.
- Worker FFmpeg membuat 360p/720p/1080p.
- Master playlist dan subtitle WebVTT.
- `HlsAdapter` berbasis hls.js dengan native HLS fallback.
- Backend playback sederhana dan pencatatan progress.
- Pengujian Chrome, Firefox, Edge, Safari, Android, dan iPhone.

**Selesai ketika:** kualitas otomatis bekerja, subtitle sinkron, seeking stabil, resume tersimpan, dan file master tidak terekspos publik.

### Tahap C — CDN, akses kuat, dan DRM

**Tujuan:** menyiapkan layanan untuk trafik dan perjanjian lisensi yang lebih serius.

- CDN di depan origin privat.
- Signed URL atau signed cookie dengan masa berlaku pendek.
- Entitlement berdasarkan akun, paket, wilayah, dan masa lisensi.
- Observability untuk startup time, buffering, error, bitrate, dan bandwidth.
- DRM hanya sesuai kontrak; gunakan penyedia managed bila tim masih kecil.
- Audit keamanan, pengujian perangkat, dan prosedur pencabutan konten.

**Selesai ketika:** URL tidak dapat dipakai setelah kedaluwarsa, origin tidak mudah diakses langsung, batas lisensi diterapkan, dan pengujian DRM lulus pada perangkat target.

---

## 7. Estimasi biaya dan kapasitas

Estimasi berikut adalah model kasar untuk perencanaan, bukan harga vendor. Biaya nyata bergantung pada wilayah, penyedia, codec, cache hit ratio, durasi, kualitas, dan jumlah penonton.

### 7.1 Asumsi contoh

- Durasi film: 120 menit.
- Rata-rata bitrate adaptif selama menonton: 2,5 Mbps.
- Output HLS tiga kualitas: sekitar 7,5 GB per film, termasuk audio dan overhead.
- File master: sekitar 8–20 GB per film.
- Satu penayangan penuh pada 2,5 Mbps: sekitar 2,25 GB transfer.

Rumus cepat:

```text
Transfer per tontonan (GB)
= bitrate rata-rata (Mbps) x durasi (detik) / 8 / 1.000

Bandwidth bulanan (GB)
= jumlah tontonan penuh x transfer per tontonan

Storage katalog
= jumlah film x (master + seluruh rendition + subtitle/poster)
```

### 7.2 Per tahap

| Tahap | Storage | Bandwidth | Transcoding |
|---|---:|---:|---:|
| A: YouTube | Nyaris nol | Ditanggung YouTube | Tidak ada |
| B: HLS awal | 15–30 GB/film | ~2,25 GB/tonton | Sekali per film |
| C: produksi | Sesuai katalog | Biaya terbesar | Batch + retry |

**Tahap A:** biaya aplikasi dapat tetap di free tier hosting selama trafik kecil. Biaya video ditangani platform sumber, tetapi NobarHub mengikuti kebijakan embed dan ketersediaannya.

**Tahap B:** biaya terdiri dari object storage, komputasi transcoding, request file, dan data transfer. Untuk demo satu film, jalankan FFmpeg sekali pada mesin sendiri atau worker sewaan singkat; hindari server transcoding yang hidup 24 jam.

**Tahap C:** bandwidth/CDN biasanya menjadi komponen dominan. Tambahkan biaya database, antrean job, monitoring, backup, DRM/license service, dan dukungan operasional.

### 7.3 Contoh skenario kapasitas

Dengan asumsi 1.000 penayangan penuh per bulan pada rata-rata 2,5 Mbps:

```text
1.000 x 2,25 GB = sekitar 2,25 TB transfer per bulan
```

Angka ini menunjukkan mengapa harga egress/CDN harus dihitung sebelum rilis. Masukkan harga resmi penyedia yang dipilih ke rumus; jangan memakai angka vendor lama dari artikel pihak ketiga.

### 7.4 Cara menekan biaya

- Batasi 1080p hanya untuk sumber yang benar-benar mendukung.
- Gunakan CDN dengan cache hit tinggi dan origin privat.
- Hapus output transcoding gagal atau duplikat.
- Transcode sekali, distribusikan berkali-kali.
- Ukur bitrate aktual, jangan mengandalkan resolusi saja.
- Tetapkan batas upload admin dan validasi format sebelum job berjalan.
- Gunakan AV1/HEVC hanya setelah kompatibilitas dan biaya encoding diuji; H.264 tetap baseline aman untuk tahap awal.

---

## 8. Risiko teknis dan mitigasi

### Hak tayang dan wilayah

**Risiko:** konten diputar di luar masa atau wilayah lisensi.  
**Mitigasi:** simpan periode dan wilayah lisensi sebagai data wajib, periksa pada setiap pembuatan sesi playback, serta sediakan tombol pencabutan publikasi.

### Kebocoran URL

**Risiko:** manifest dibagikan ke pihak lain.  
**Mitigasi:** origin privat, token berumur pendek, pembatasan path, rate limit, dan DRM bila diwajibkan. Referer check saja tidak cukup.

### Buffering

**Risiko:** bitrate terlalu tinggi atau segmen lambat.  
**Mitigasi:** ladder multi-bitrate, segmen konsisten, CDN, pengujian jaringan lambat, dan telemetri quality-of-experience.

### Ketidakcocokan browser

**Risiko:** codec, HLS, subtitle, atau DRM gagal di perangkat tertentu.  
**Mitigasi:** H.264/AAC sebagai baseline, native HLS fallback, matriks pengujian perangkat nyata, dan progressive enhancement.

### Transcoding gagal

**Risiko:** input rusak, audio hilang, subtitle tidak sinkron, atau worker berhenti.  
**Mitigasi:** `ffprobe` sebelum proses, job idempotent, retry terbatas, log terstruktur, checksum, dan verifikasi output sebelum status `READY`.

### Biaya melonjak

**Risiko:** hotlink, trafik bot, cache miss, atau kualitas tinggi dipilih terus-menerus.  
**Mitigasi:** signed access, batas laju, alarm biaya, cache policy, dashboard bandwidth, dan kill switch per film.

### Resume tidak akurat

**Risiko:** terlalu banyak write atau posisi tertimpa dari beberapa perangkat.  
**Mitigasi:** debounce, timestamp pembaruan, aturan last-write-wins yang jelas, dan tandai selesai mendekati akhir film.

---

## 9. Checklist implementasi NobarHub

### Sekarang

- [ ] Buat tipe `VideoSource` sebagai discriminated union.
- [ ] Pisahkan `MoviePlayer` dan `YouTubeAdapter`.
- [ ] Label sumber sebagai trailer atau film penuh resmi.
- [ ] Buat state loading, unavailable, blocked, dan error.
- [ ] Pastikan ID YouTube disimpan sebagai data, bukan iframe mentah dari input pengguna.
- [ ] Tambahkan catatan hak tayang pada model data admin.

### Saat mendapat film berizin

- [ ] Simpan bukti izin dan cakupan wilayah/waktu di luar metadata publik.
- [ ] Upload master ke bucket privat.
- [ ] Jalankan `ffprobe`, lalu transcode ke tiga rendition HLS.
- [ ] Verifikasi audio, subtitle, durasi, seeking, dan sinkronisasi.
- [ ] Tambahkan `HlsAdapter` dan endpoint playback.
- [ ] Simpan progress pengguna dengan interval terkontrol.
- [ ] Uji browser dan perangkat target.

### Sebelum produksi berbayar

- [ ] Tambahkan CDN dan pembatasan origin.
- [ ] Terapkan signed URL/cookie serta refresh sesi.
- [ ] Terapkan entitlement wilayah, paket, dan periode lisensi.
- [ ] Pasang monitoring playback dan alarm biaya.
- [ ] Konfirmasi kebutuhan DRM dari kontrak.
- [ ] Lakukan audit keamanan dan prosedur takedown.

---

## 10. Keputusan arsitektur final

Untuk versi portofolio satu minggu, NobarHub tetap menggunakan embed trailer YouTube resmi. Namun, codebase sejak awal memakai abstraksi `VideoSource`, sehingga penambahan HLS berlisensi hanya menambahkan adapter dan endpoint playback, bukan merombak halaman Nonton.

Target teknis jangka menengah:

```text
Next.js + TypeScript
  + metadata film
  + MoviePlayer shell
      + YouTubeAdapter (sekarang)
      + HlsAdapter (setelah ada lisensi)
  + Playback API
  + Progress API
  + private object storage
  + FFmpeg worker
  + CDN + signed access
  + DRM hanya jika kontrak mewajibkan
```

Prinsip utamanya: **hak tayang lebih dulu, sumber video kedua, teknologi player ketiga**. Teknologi dapat diganti; legalitas sumber tidak dapat digantikan oleh solusi teknis.

---

## Referensi teknis

- [Dokumentasi format FFmpeg](https://ffmpeg.org/ffmpeg-formats.html)
- [Repositori resmi hls.js](https://github.com/video-dev/hls.js)
- [Dokumentasi awal Shaka Player](https://github.com/shaka-project/shaka-player/blob/HEAD/docs/tutorials/welcome.md)

Referensi ini mendukung pemilihan FFmpeg untuk packaging HLS, hls.js untuk playback HLS berbasis HTML5/MSE, serta Shaka Player untuk playback adaptif HLS/DASH dan jalur EME/DRM. Harga infrastruktur tidak dicantumkan sebagai tarif vendor karena berubah menurut penyedia dan wilayah; gunakan rumus kapasitas pada dokumen ini dengan harga resmi penyedia saat akan deploy.

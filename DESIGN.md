---
version: 2.0.0
name: NobarHub PWA
description: Desain mobile-first (PWA) dengan tema dark cinematic dan glassmorphism. Hero besar dengan film unggulan, trending section, dan floating navigation.
colors:
  background: '#121110'
  surface: '#1c1a17'
  surfaceHover: '#262420'
  border: '#33312c'
  borderSubtle: '#1c1a17'
  primary: '#f5b50a'
  primaryHover: '#d49b08'
  primaryPressed: '#b48307'
  textPrimary: '#fafafa'
  textSecondary: '#a1a1aa'
  textMuted: '#71717a'
  textDisabled: '#52525b'
  glassDark: 'rgba(0, 0, 0, 0.3)'
  glassLight: 'rgba(255, 255, 255, 0.1)'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: '-0.02em'
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '-0.01em'
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.3
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: '0.02em'
  label:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: '0.01em'
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.background}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 12px 16px
  button-primary-hover:
    backgroundColor: '{colors.primaryHover}'
    textColor: '{colors.background}'
  button-primary-pressed:
    backgroundColor: '{colors.primaryPressed}'
    textColor: '#121110'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.textSecondary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 12px 16px
  button-ghost-hover:
    backgroundColor: '{colors.surfaceHover}'
    textColor: '{colors.textPrimary}'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.textPrimary}'
    rounded: '{rounded.xl}'
    padding: 0
  card-hover:
    backgroundColor: '{colors.surfaceHover}'
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.textPrimary}'
    rounded: '{rounded.md}'
    padding: 8px 12px
  badge-genre:
    backgroundColor: '{colors.surfaceHover}'
    textColor: '{colors.textSecondary}'
    typography: '{typography.caption}'
    rounded: '{rounded.full}'
    padding: 4px 12px
  badge-active:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.background}'
---

## Overview

NobarHub dirancang khusus sebagai **Progressive Web App (PWA) mobile-first** dengan nuansa dark cinematic charcoal. Aplikasi ini fokus pada kenyamanan akses di layar sentuh (mobile portrait), tipografi besar yang ramah, dan penggunaan aksen emas yang premium. Antarmuka menggunakan **Bahasa Indonesia** secara keseluruhan.

Desain PWA menghindari antarmuka web tradisional seperti Top Navbar statis atau layout melebar yang kosong. Semua elemen UI memprioritaskan imersi pengguna terhadap poster dan backdrop film.

## Colors

### Background & Surface

- **background (#121110):** Latar utama aplikasi (charcoal dark). Sangat gelap, memberikan kedalaman untuk backdrop film.
- **surface (#1c1a17):** Background kartu, panel, dialog, atau tab bar.
- **surfaceHover (#262420):** State hover untuk kartu atau tombol sekunder.
- **border (#33312c):** Border standar untuk input, dropdown, atau pemisah.
- **borderSubtle (#1c1a17):** Border halus (hampir menyatu dengan surface).

### Primary (Aksen Utama)

- **primary (#f5b50a):** Emas / Amber. Warna tunggal untuk CTA, PWA install banner, state aktif, dan fokus.
- **primaryHover (#d49b08):** Emas lebih gelap untuk state hover.
- **primaryPressed (#b48307):** Emas ditekan (pressed state).

### Text Hierarchy

- **textPrimary (#fafafa):** Teks putih terang untuk judul dan isi utama.
- **textSecondary (#a1a1aa):** Abu-abu menengah untuk metadata (genre, tahun).
- **textMuted (#71717a):** Abu-abu gelap untuk placeholder input atau caption minor.

## Typography

**Font Utama:** Plus Jakarta Sans. Bebas dari font tambahan, memiliki proporsi geometri yang sangat baik untuk antarmuka PWA, modern, dan mudah dibaca pada ukuran kecil (mobile).

## Layout & Mobile-First Constraints

- **App Shell:** Full-width layout untuk hero dan trending
- **Max Container:** `max-w-7xl mx-auto` untuk content area di desktop
- **Glassmorphism Navigation:** Floating top & bottom nav dengan backdrop blur kuat
- **Hero:** 85vh height, backdrop full-screen dengan gradient overlay
- **Trending:** Horizontal scroll dengan snap-x, card width 140px

## Core UI Components

### 1. Hero Section
Hero menampilkan satu film unggulan dengan backdrop full-screen, info lengkap (judul, rating, durasi, genre), dan tombol aksi.
- **Backdrop:** Full-screen dengan gradient overlay gelap untuk keterbacaan
- **Info Film:** Judul besar, metadata (rating, tahun, durasi, genre), tombol "Tonton Trailer" + "Watchlist"
- **Trending Section:** Horizontal scroll card poster di bawah hero

### 2. Navigasi (Glassmorphism)
- **Top Nav (Floating):** Background hitam 30% dengan backdrop-blur-2xl, rounded-2xl, border putih tipis. Logo NOBARHUB + icon search & notifikasi. Floating dengan padding dari atas.
- **Bottom Tab Bar (Floating):** Background hitam 30% dengan backdrop-blur-2xl, rounded-[28px], border putih tipis. 4 tab: Beranda, Cari, Watchlist, Profil. Tab aktif highlight kuning emas 20%. Floating dengan padding dari bawah dan samping.

### 3. PWA Install Banner
Banner kuning emas (#f5b50a) dengan teks hitam, rounded-2xl, shadow kuat. Posisi di bawah top nav (top-16). Menampilkan "Pasang NOBARHUB ke Layar Utama" + tombol "Pasang" + close button. Animasi slideDown smooth. Auto-hide setelah dismiss atau install, reset setelah 7 hari.

### 4. Movie Card & Trailer Player
- **Poster Card:** Aspect ratio 2:3, rounded-lg, hover scale 105%
- **Modal Trailer Player:** Ketika ditekan, trailer memutar video embed (YouTube). Modal player memiliki pesan: **"Tonton Film Full — Segera Hadir"**.

## Do's and Don'ts

### Do
- Gunakan glassmorphism (backdrop-blur-2xl + background hitam/putih transparan) untuk navigasi
- Gunakan gradient overlay gelap di atas gambar backdrop agar teks tetap dapat dibaca
- Floating navigation dengan padding dan rounded untuk feel modern
- Gunakan warna emas (#f5b50a) sebagai accent color untuk CTA dan active state
- Pastikan semua label UI menggunakan Bahasa Indonesia yang natural dan tidak terlalu formal

### Don't
- Jangan gunakan Top Navbar solid penuh layar
- Jangan gunakan warna gradient yang berat atau berwarna-warni
- Jangan gunakan warna emas untuk background elemen besar (kecuali banner PWA)
- Jangan gunakan kata-kata formal seperti "resmi", "legal" yang kedengeran AI

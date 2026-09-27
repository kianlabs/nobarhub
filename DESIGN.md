---
version: 1.0.0
name: NobarHub Final PWA
description: Desain mobile-first (PWA) dengan tema dark cinematic charcoal dan aksen emas.
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

- **App Shell Container:** Menggunakan container sempit `max-w-md mx-auto` di layar desktop agar terasa seperti mobile app, dengan background charcoal penuh di sekitarnya.
- **Grid Poster (Katalog):** 3 kolom poster (`grid-cols-3`) pada perangkat mobile, dengan jarak (gap) `sm` (8px).
- **Row Horizontal:** Daftar trending / populer menggunakan row yang bisa di-scroll secara horizontal (`overflow-x-auto snap-x`).

## Core UI Components

### 1. Hero Backdrop Full-Bleed
Hero tidak berada di dalam container dengan padding. Backdrop film harus **full-bleed sampai ujung bawah layar mobile**.
- **Wajib:** Menggunakan *gradient overlay* gelap (hitam/charcoal transparan) di bagian ATAS (untuk visibilitas kata NobarHub dan ikon) dan BAWAH (untuk keterbacaan judul film dan CTA tombol play).

### 2. Navigasi (PWA-First)
- **Header Transparan Melayang:** Terletak di atas overlay Hero, hanya berisi Wordmark "NobarHub", ikon Pencarian, dan ikon Lonceng (Notifikasi). Tanpa background warna solid (bukan top navbar 64px).
- **Bottom Tab Bar:** Terletak `fixed bottom-0`. Berisi 4 tab utama: **Beranda**, **Cari**, **Watchlist**, dan **Profil**. Tab aktif berwarna Emas (`#f5b50a`).

### 3. PWA Install Banner
Banner warna Emas (`#f5b50a`) dengan teks gelap yang terletak melayang tepat di atas Bottom Tab Bar. Menampilkan tulisan "Pasang NobarHub ke Layar Utama • Pasang".

### 4. Movie Card & Trailer Player
- **Poster Card:** Memiliki *aspect ratio* 2:3. Menampilkan judul film di bawah poster. Pada hero atau banner khusus, dapat memiliki ikon tombol "Play" (overlay bulat transparan).
- **Modal Trailer Player:** Ketika ditekan, trailer memutar video embed resmi (YouTube). Modal player memiliki pesan peringatan yang jelas: **"Tonton Film Full — Segera Hadir"**. NobarHub 100% legal dan bebas dari tayangan bajakan.

## Do's and Don'ts

### Do
- Gunakan gradient overlay gelap di atas gambar backdrop agar teks tetap dapat dibaca.
- Jadikan aplikasi terasa seperti *Native Mobile App* dengan Bottom Tab Bar dan interaksi sentuhan (swipe/scroll horizontal).
- Gunakan warna emas (`#f5b50a`) sebagai call-to-action tunggal yang jelas.
- Pastikan semua label UI menggunakan Bahasa Indonesia yang natural.

### Don't
- **Jangan** gunakan Top Navbar konvensional (64px solid) sebagai navigasi utama.
- **Jangan** gunakan warna gradient yang berat atau berwarna-warni selain dari gradient shadow/overlay (transparan ke hitam) untuk keterbacaan.
- **Jangan** gunakan warna emas sembarangan untuk background elemen besar (kecuali banner PWA).
- **Jangan** memberi kesan tersedianya akses nonton film bajakan. Selalu perjelas bahwa tayangan adalah trailer resmi.

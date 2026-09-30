import type { Metadata, Viewport } from "next";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#121110",
};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nobarhub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NobarHub — Katalog & Rekomendasi Film Sinematik",
    template: "%s | NobarHub",
  },
  description:
    "Katalog film modern bergaya sinematik dark charcoal & aksen emas. Temukan trailer resmi, sinopsis, daftar pemeran, dan simpan film ke watchlist.",
  keywords: ["katalog film", "rekomendasi film", "nonton film", "trailer film", "sinopsis film", "nobarhub"],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon-180.png",
  },
  openGraph: {
    title: "NobarHub — Katalog & Rekomendasi Film Sinematik",
    description:
      "Katalog film modern bergaya sinematik dark charcoal & aksen emas. Temukan trailer resmi, sinopsis, daftar pemeran, dan simpan film ke watchlist.",
    url: siteUrl,
    siteName: "NobarHub",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NobarHub — Katalog Film Sinematik",
    description: "Temukan trailer resmi, sinopsis, daftar pemeran, dan simpan film favorit ke watchlist.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NobarHub",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#121110] text-[#fafafa]">
        <PWAInstallBanner />
        {children}
      </body>
    </html>
  );
}

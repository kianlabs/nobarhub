import type { Metadata, Viewport } from "next";
import { InstallBanner } from "@/components/InstallBanner";
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

export const metadata: Metadata = {
  title: "NobarHub",
  description: "Katalog film portofolio bergaya sinematik dengan mode gelap.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
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
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#fafafa]">
        <InstallBanner />
        {children}
      </body>
    </html>
  );
}

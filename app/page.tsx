import { Suspense } from "react";
import { fetchTrending, getMovieDetail } from "@/lib/tmdb";
import { BottomTabBar } from "@/components/BottomTabBar";
import { TopNavbar } from "@/components/TopNavbar";
import { HeroSection } from "@/components/HeroSection";
import { TrendingSection } from "@/components/TrendingSection";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";
import { PageTransition } from "@/components/PageTransition";

export const metadata = {
  title: "NobarHub | Katalog Sinema Eksklusif",
  description: "Katalog film eksklusif dengan pengalaman interaktif.",
};

export default function HomePage() {
  return (
    <PageTransition>
      <div className="bg-[#121110] text-[#fafafa] min-h-screen">
        <PWAInstallBanner />
        <TopNavbar />
        <Suspense fallback={<LoadingSkeleton />}>
          <HomeContent />
        </Suspense>
        <BottomTabBar />
      </div>
    </PageTransition>
  );
}

async function HomeContent() {
  const trendingData = await fetchTrending().catch(() => ({ results: [] }));
  const movies = (trendingData.results ?? [])
    .filter(m => m.backdrop_path && m.poster_path && m.title)
    .slice(0, 15);

  if (movies.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-center px-4">
        <p className="text-[#a1a1aa]">Film belum tersedia. Silakan cek koneksi API TMDB.</p>
      </div>
    );
  }

  // Ambil detail lengkap film pertama untuk hero
  const featuredMovie = await getMovieDetail(movies[0].id).catch(() => null);

  if (!featuredMovie) {
    return (
      <div className="h-screen flex items-center justify-center text-center px-4">
        <p className="text-[#a1a1aa]">Gagal memuat film unggulan.</p>
      </div>
    );
  }

  const trendingMovies = movies.slice(1, 11); // Ambil 10 film untuk trending section

  return (
    <>
      <HeroSection movie={featuredMovie} />
      <TrendingSection movies={trendingMovies} />
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse text-[#a1a1aa]">Memuat...</div>
    </div>
  );
}

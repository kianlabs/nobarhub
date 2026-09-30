import { Suspense } from "react";
import { fetchTrending, getMovieDetail, getNowPlaying, getTopRated } from "@/lib/tmdb";
import { BottomTabBar } from "@/components/BottomTabBar";
import { TopNavbar } from "@/components/TopNavbar";
import { HeroSection } from "@/components/HeroSection";
import { TrendingSection } from "@/components/TrendingSection";
import { PageTransition } from "@/components/PageTransition";

export const metadata = {
  title: "NobarHub | Katalog Sinema Eksklusif",
  description: "Katalog film eksklusif dengan pengalaman interaktif.",
};

export default function HomePage() {
  return (
    <PageTransition>
      <div className="bg-[#121110] text-[#fafafa] min-h-screen">
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
  const [trendingData, nowPlayingData, topRatedData] = await Promise.all([
    fetchTrending().catch(() => ({ results: [] })),
    getNowPlaying().catch(() => ({ results: [] })),
    getTopRated().catch(() => ({ results: [] })),
  ]);

  const trendingList = (trendingData.results ?? []).filter(
    (m) => m.backdrop_path && m.poster_path && m.title
  );

  if (trendingList.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-center px-4">
        <p className="text-[#a1a1aa]">Film belum tersedia. Silakan cek koneksi API TMDB.</p>
      </div>
    );
  }

  // Ambil detail lengkap film trending pertama untuk hero
  const featuredMovie = await getMovieDetail(trendingList[0].id).catch(() => null);

  if (!featuredMovie) {
    return (
      <div className="h-screen flex items-center justify-center text-center px-4">
        <p className="text-[#a1a1aa]">Gagal memuat film unggulan.</p>
      </div>
    );
  }

  const trendingMovies = trendingList.slice(1, 13);
  const nowPlayingMovies = (nowPlayingData.results ?? [])
    .filter((m) => m.poster_path && m.title)
    .slice(0, 12);
  const topRatedMovies = (topRatedData.results ?? [])
    .filter((m) => m.poster_path && m.title)
    .slice(0, 12);

  return (
    <>
      <HeroSection movie={featuredMovie} />
      <div className="pb-24 md:pb-12 space-y-2">
        <TrendingSection
          title="Trending Minggu Ini"
          movies={trendingMovies}
          delay={0.1}
        />
        {nowPlayingMovies.length > 0 && (
          <TrendingSection
            title="Sedang Tayang di Bioskop"
            movies={nowPlayingMovies}
            delay={0.2}
          />
        )}
        {topRatedMovies.length > 0 && (
          <TrendingSection
            title="Rating Tertinggi Sepanjang Masa"
            movies={topRatedMovies}
            delay={0.3}
          />
        )}
      </div>
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

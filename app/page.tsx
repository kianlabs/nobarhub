import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { fetchTrending, getNowPlaying, getTopRated, backdropUrl } from "@/lib/tmdb";
import { HomeSkeleton } from "@/components/Skeleton";
import { HeroActions } from "@/components/HeroActions";
import { BottomTabBar } from "@/components/BottomTabBar";
import { TopNavbar } from "@/components/TopNavbar";

export const metadata = {
  title: "NobarHub",
  description: "Katalog film trending dengan desain mobile-first.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#121110] text-[#fafafa] flex flex-col w-full relative overflow-hidden pb-20 md:pb-0">
      <TopNavbar />
      <Suspense fallback={<HomeSkeleton />}>
        <TrendingContent />
      </Suspense>
    </div>
  );
}

async function TrendingContent() {
  // Fetch multiple data sources in parallel
  const [trendingData, nowPlayingData, topRatedData] = await Promise.all([
    fetchTrending().catch(() => ({ results: [] })),
    getNowPlaying().catch(() => ({ results: [] })),
    getTopRated().catch(() => ({ results: [] })),
  ]);

  const trending = trendingData.results ?? [];
  const nowPlaying = nowPlayingData.results ?? [];
  const topRated = topRatedData.results ?? [];

  if (trending.length === 0) {
    return (
      <div className="py-24 text-center px-4">
        <p className="text-[#a1a1aa]">Film belum tersedia.</p>
      </div>
    );
  }

  const [hero, ...restTrending] = trending;
  const heroBackdrop = backdropUrl(hero.backdrop_path, "original");
  const year = hero.release_date ? hero.release_date.slice(0, 4) : "—";
  const rating = hero.vote_average ? hero.vote_average.toFixed(1) : "—";

  // For Bento layout (Top Rated)
  const bentoMain = topRated[0];
  const bentoSide1 = topRated[1];
  const bentoSide2 = topRated[2];

  return (
    <>
      {/* 1. Full-bleed Hero */}
      <section className="relative w-full h-[80vh] md:h-[85vh] min-h-[500px] flex flex-col justify-end mt-0 md:mt-16 group">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBackdrop}
            alt={hero.title}
            fill
            priority
            unoptimized
            className="object-cover transition-transform duration-[20s] ease-out group-hover:scale-105"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#121110]/80 via-transparent to-[#121110] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/20 to-transparent" />
        </div>

        {/* Floating Header Mobile */}
        <header className="absolute top-0 inset-x-0 z-20 flex md:hidden items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="512" rx="112" fill="#121110"/>
              <path d="M 128 176 L 384 176 L 384 216 A 40 40 0 0 0 384 296 L 384 336 L 128 336 L 128 296 A 40 40 0 0 0 128 216 Z" fill="#f5b50a"/>
              <path d="M 235 220 L 295 256 L 235 292 Z" fill="#121110"/>
            </svg>
            <span className="text-[#f5b50a] font-black tracking-tight text-lg">NOBARHUB</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <Link href="/cari">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </Link>
            <Link href="/profil">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-8 md:pb-16 space-y-4">
          <div className="inline-block bg-[#f5b50a] text-[#121110] font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded">
            Sedang Hangat
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg max-w-3xl">
            {hero.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-[#d4d4d8] font-medium">
            <span className="text-[#f5b50a] font-bold text-lg">★ {rating}</span>
            <span>•</span>
            <span>{year}</span>
            <span>•</span>
            <span className="border border-[#33312c] px-2 py-0.5 rounded text-xs bg-[#1c1a17]/50 backdrop-blur-sm">Rekomendasi</span>
          </div>
          
          <p className="text-[#a1a1aa] max-w-2xl line-clamp-2 md:line-clamp-3 text-sm md:text-base">
            {hero.overview}
          </p>

          <div className="flex items-center gap-3 pt-4 max-w-md">
            <HeroActions movie={hero} />
          </div>
        </div>
      </section>

      {/* 2. Top Rated Bento Grid */}
      {bentoMain && (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Karya Mahakarya</h2>
            <Link href="/cari" className="text-sm font-bold text-[#f5b50a] hover:text-white transition-colors">Lihat Semua</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
            {/* Main Featured */}
            <Link 
              href={`/film/${bentoMain.id}`} 
              className="relative col-span-1 md:col-span-2 h-full rounded-2xl overflow-hidden group border border-[#33312c] bg-[#1c1a17]"
            >
              <Image 
                src={backdropUrl(bentoMain.backdrop_path, "w1280")} 
                alt={bentoMain.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <span className="text-6xl font-black text-white/20 absolute -top-4 -left-2 z-0 pointer-events-none">1</span>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-4xl font-black text-white mb-2">{bentoMain.title}</h3>
                  <div className="text-[#f5b50a] font-bold text-sm">★ {bentoMain.vote_average.toFixed(1)}</div>
                </div>
              </div>
            </Link>

            {/* Right Side Stack */}
            <div className="hidden md:flex flex-col gap-4 h-full">
              {[bentoSide1, bentoSide2].map((m, idx) => m && (
                <Link 
                  key={m.id} 
                  href={`/film/${m.id}`} 
                  className="relative flex-1 rounded-2xl overflow-hidden group border border-[#33312c] bg-[#1c1a17]"
                >
                  <Image 
                    src={backdropUrl(m.backdrop_path, "w500")} 
                    alt={m.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/40 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="text-4xl font-black text-white/20 absolute top-0 -left-1 z-0 pointer-events-none">{idx + 2}</span>
                    <div className="relative z-10">
                      <h3 className="text-lg font-black text-white mb-1 line-clamp-1">{m.title}</h3>
                      <div className="text-[#f5b50a] font-bold text-xs">★ {m.vote_average.toFixed(1)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Now Playing Marquee (Unique "Lots of Movies" Vibe) */}
      {nowPlaying.length > 8 && (
        <section className="w-full py-12 md:py-16 overflow-hidden bg-[#1c1a17]/30 border-y border-[#33312c]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-6">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Sedang Tayang di Bioskop</h2>
            <p className="text-sm text-[#a1a1aa] mt-1">Saksikan deretan aksi layar lebar terbaru.</p>
          </div>
          
          <div className="relative flex overflow-x-hidden group">
            {/* Double the list for infinite scroll effect */}
            <div className="animate-[marquee_40s_linear_infinite] flex whitespace-nowrap gap-4 md:gap-6 px-4 shrink-0 group-hover:[animation-play-state:paused]">
              {[...nowPlaying, ...nowPlaying].map((m, i) => (
                <Link 
                  href={`/film/${m.id}`} 
                  key={`${m.id}-${i}`} 
                  className="relative w-[140px] md:w-[200px] aspect-[2/3] rounded-xl overflow-hidden shrink-0 border border-[#33312c] transition-transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#f5b50a]/20"
                >
                  <Image 
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} 
                    alt={m.title} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 140px, 200px" 
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Trending This Week (Standard Horizontal Row) */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-6">Trending Minggu Ini</h2>
        <div className="flex md:grid gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x md:snap-none pb-4 md:pb-8 md:grid-cols-5 lg:grid-cols-6 custom-scrollbar">
          {restTrending.slice(0, 12).map(m => (
            <Link href={`/film/${m.id}`} key={m.id} className="min-w-[140px] md:min-w-0 snap-start relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1c1a17] transition-transform hover:scale-[1.03] group border border-[#33312c]">
              {m.poster_path ? (
                <>
                  <Image src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} fill className="object-cover" sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <span className="text-white font-bold text-xs truncate">{m.title}</span>
                    <span className="text-[#f5b50a] text-[10px] font-bold">★ {m.vote_average.toFixed(1)}</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#a1a1aa] p-4 text-center">
                  Poster Tidak Tersedia
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      <BottomTabBar />
    </>
  );
}

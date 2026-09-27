import type { Video } from "@/types";

interface TrailerPlayerProps {
  videos: Video[];
  title: string;
}

export function TrailerPlayer({ videos, title }: TrailerPlayerProps) {
  // Filter video YouTube: prioritaskan trailer official, fallback ke trailer youtube apa pun, lalu video youtube apa pun
  const youtubeVideos = (videos || []).filter(
    (v) => v.site && v.site.toLowerCase() === "youtube" && Boolean(v.key)
  );

  const trailer =
    youtubeVideos.find(
      (v) =>
        v.type &&
        v.type.toLowerCase() === "trailer" &&
        v.official === true
    ) ||
    youtubeVideos.find(
      (v) => v.type && v.type.toLowerCase() === "trailer"
    ) ||
    youtubeVideos.find(
      (v) => v.type && v.type.toLowerCase() === "teaser"
    ) ||
    youtubeVideos[0];

  if (!trailer) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-1">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-zinc-300">
          Trailer belum tersedia untuk film ini.
        </h3>
        <p className="text-sm text-zinc-500 max-w-md">
          Kami belum menemukan trailer YouTube dari TMDB untuk film ini. Tonton film full akan segera hadir.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 16:9 Responsive Video Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-2xl shadow-black/80">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0&modestbranding=1`}
          title={`Trailer ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* Disclaimer Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-4 py-3 text-xs text-zinc-400 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>
            Trailer disediakan melalui YouTube embed TMDB. Tonton Film Full — Segera Hadir.
          </span>
        </div>
        <span className="inline-flex items-center self-start sm:self-auto rounded-full bg-red-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-red-400 border border-red-800/40">
          Segera Hadir
        </span>
      </div>
    </div>
  );
}

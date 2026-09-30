import Image from "next/image";
import { profileUrl } from "@/lib/tmdb";
import type { CastMember } from "@/types";

interface CastSectionProps {
  cast?: CastMember[];
  className?: string;
}

export function CastSection({ cast, className = "" }: CastSectionProps) {
  if (!cast || cast.length === 0) return null;

  const topCast = cast.slice(0, 12);
  if (topCast.length === 0) return null;

  return (
    <section className={`max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 ${className}`}>
      <h2 className="text-lg md:text-xl font-bold text-white mb-4">
        Pemeran Utama
      </h2>
      <div className="overflow-x-auto scrollbar-none hide-scrollbar flex gap-3 md:gap-4 pb-2">
        {topCast.map((member, index) => (
          <div
            key={`${member.id}-${index}`}
            className="flex flex-col items-center text-center shrink-0 w-20 md:w-24 group"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#1c1a17] border border-[#33312c] mb-2 shrink-0 group-hover:border-[#f5b50a]/60 transition-colors shadow-sm">
              <Image
                src={profileUrl(member.profile_path)}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 64px, 80px"
                className="object-cover"
              />
            </div>
            <p
              className="text-white font-medium text-xs md:text-sm truncate w-full"
              title={member.name}
            >
              {member.name}
            </p>
            <p
              className="text-[#a1a1aa] text-[11px] md:text-xs truncate w-full"
              title={member.character}
            >
              {member.character || "—"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

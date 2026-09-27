export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-800/80 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative w-full h-[70vh] min-h-[480px] max-h-[720px] bg-zinc-900 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-12 lg:p-16 max-w-2xl space-y-4 w-full">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-10 md:h-14 w-3/4 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>
    </section>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>
      <Skeleton className="h-4 w-5/6" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function HomeSkeleton() {
  return (
    <div className="w-full">
      <HeroSkeleton />
      <MovieGridSkeleton />
    </div>
  );
}

import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function MovieNotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-800/50 flex items-center justify-center mx-auto text-red-500">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Film Tidak Ditemukan
            </h1>
            <p className="text-sm text-zinc-400">
              Film yang Anda cari tidak tersedia, memiliki ID yang tidak valid, atau telah dihapus dari katalog TMDB.
            </p>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-950/40"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800/80 bg-[#09090b] py-8 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} NobarHub. Data film disediakan oleh TMDB API.</p>
      </footer>
    </div>
  );
}

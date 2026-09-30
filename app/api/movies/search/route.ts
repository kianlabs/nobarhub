import { NextRequest, NextResponse } from "next/server";
import { searchMovies, discoverMovies, fetchTrending } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q")?.trim();
    const genre = searchParams.get("genre");
    const year = searchParams.get("year");

    let data;
    if (q) {
      data = await searchMovies(q);
    } else if (genre || year) {
      data = await discoverMovies({
        genre: genre ? Number(genre) : undefined,
        year: year ? Number(year) : undefined,
      });
    } else {
      data = await fetchTrending();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gagal mencari film:", error);
    return NextResponse.json(
      { error: "Gagal mencari film" },
      { status: 500 }
    );
  }
}

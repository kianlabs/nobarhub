import { NextRequest, NextResponse } from "next/server";
import { getMovieDetail } from "@/lib/tmdb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const movieId = Number(id);

    if (isNaN(movieId) || movieId <= 0) {
      return NextResponse.json(
        { error: "ID film tidak valid" },
        { status: 400 }
      );
    }

    const movie = await getMovieDetail(movieId);
    return NextResponse.json(movie);
  } catch (error: unknown) {
    console.error("Gagal memuat detail film:", error);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("404")) {
      return NextResponse.json(
        { error: "Film tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Gagal memuat detail film" },
      { status: 500 }
    );
  }
}

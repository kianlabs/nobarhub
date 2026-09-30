import { NextRequest, NextResponse } from "next/server";
import { fetchVideos } from "@/lib/tmdb";

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

    const video = await fetchVideos(movieId);
    return NextResponse.json({ video });
  } catch (error) {
    console.error("Gagal memuat video film:", error);
    return NextResponse.json(
      { error: "Gagal memuat video film" },
      { status: 500 }
    );
  }
}

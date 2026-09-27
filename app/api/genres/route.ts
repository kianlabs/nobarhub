import { getGenres } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getGenres();
    return NextResponse.json(data.genres);
  } catch (error) {
    console.error("Gagal memuat genre:", error);
    return NextResponse.json(
      { error: "Gagal memuat genre" },
      { status: 500 }
    );
  }
}

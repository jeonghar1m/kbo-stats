import { NextResponse } from "next/server";
import { fetchStandings } from "@/lib/standings";

export async function GET() {
  try {
    const standings = await fetchStandings();
    return NextResponse.json(standings);
  } catch {
    return NextResponse.json([]);
  }
}

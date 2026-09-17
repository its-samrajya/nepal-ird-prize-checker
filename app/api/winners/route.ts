import { NextResponse } from "next/server";
import { fetchAllWinners } from "@/lib/winners";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchAllWinners();
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve winner data";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
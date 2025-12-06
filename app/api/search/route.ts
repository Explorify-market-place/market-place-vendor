// app/api/search/route.ts
import { NextResponse } from "next/server";
import { searchPackages } from "@/lib/mockPackages";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const term = url.searchParams.get("term") ?? undefined;

    // For now return the mock filtered list.
    // Later you can switch this to query DB or call external service.
    const results = searchPackages(term);

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("api/search error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

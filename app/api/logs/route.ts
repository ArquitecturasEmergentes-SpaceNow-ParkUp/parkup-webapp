import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { endpoints } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const query = request.nextUrl.searchParams.toString();
    const url = query ? `${endpoints.logs.getAll}?${query}` : endpoints.logs.getAll;

    const backendResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await backendResponse.json().catch(() => null);
    if (!backendResponse.ok || !data) {
      return NextResponse.json({ error: data?.error || "Failed to fetch logs" }, { status: backendResponse.status || 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("/api/logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

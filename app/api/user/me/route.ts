import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { endpoints } from "@/lib/config";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const backendResponse = await fetch(endpoints.users.me, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await backendResponse.json().catch(() => null);
    if (!backendResponse.ok || !data) {
      return NextResponse.json({ error: data?.error || "Failed to fetch user" }, { status: backendResponse.status || 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("/api/user/me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
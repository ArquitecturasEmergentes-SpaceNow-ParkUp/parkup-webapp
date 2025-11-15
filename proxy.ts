import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const userId = request.cookies.get("user_id")?.value;
  const path = request.nextUrl.pathname;

  console.log("[Proxy]", path, "- token:", !!token, "userId:", userId);

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register", "/"];
  const isPublicPath = publicPaths.includes(path);

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    console.log("[Proxy] No token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has token and trying to access login/register, redirect to dashboard
  // The dashboard layout will handle role-based redirects
  if (token && userId && (path === "/login" || path === "/register")) {
    console.log(
      "[Proxy] User authenticated on login page, redirecting to /dashboard",
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For protected routes, allow them through
  // The layouts will handle role-based access control
  if (token && userId) {
    console.log("[Proxy] Authenticated user accessing:", path);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

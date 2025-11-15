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

  // If has token and trying to access login/register, redirect based on role
  if (token && userId && (path === "/login" || path === "/register")) {
    console.log("[Proxy] User authenticated on login page, checking roles...");
    try {
      // Fetch user data to get roles
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/users/${userId}`;
      console.log("[Proxy] Fetching user from:", apiUrl);

      const userResponse = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("[Proxy] User fetch status:", userResponse.status);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const roles = userData.roles || [];
        const isAdmin = roles.includes("ROLE_ADMIN");

        console.log("[Proxy] User roles:", roles, "isAdmin:", isAdmin);

        // Redirect based on role
        if (isAdmin) {
          console.log("[Proxy] Redirecting admin to /admin");
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        console.log("[Proxy] Redirecting user to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        console.log("[Proxy] User fetch failed, allowing request");
      }
    } catch (error) {
      console.error("[Proxy] Error checking roles:", error);
    }
    // Fallback to dashboard if role check fails
    console.log("[Proxy] Fallback redirect to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For protected routes, we need to verify roles
  if (token && userId) {
    const isAdminPath = path.startsWith("/admin");
    const isDashboardPath = path.startsWith("/dashboard");

    try {
      // Fetch user data to get roles
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const roles = userData.roles || [];
        const isAdmin = roles.includes("ROLE_ADMIN");

        // Admin trying to access user dashboard - redirect to admin
        if (isAdmin && isDashboardPath && !isAdminPath) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        // User trying to access admin panel - redirect to dashboard
        if (!isAdmin && isAdminPath) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // Admin accessing admin panel or user accessing dashboard - allow
        return NextResponse.next();
      }

      // If user fetch fails, clear cookies and redirect to login
      const loginRedirect = NextResponse.redirect(
        new URL("/login", request.url),
      );
      loginRedirect.cookies.delete("session");
      loginRedirect.cookies.delete("user_id");
      loginRedirect.cookies.delete("user_email");
      return loginRedirect;
    } catch (error) {
      console.error("Proxy error:", error);
      // On error, allow the request but log it
      return NextResponse.next();
    }
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

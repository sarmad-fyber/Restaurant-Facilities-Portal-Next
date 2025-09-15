import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which roles are allowed for specific path prefixes.
// More specific paths should come first if there's an overlap,
// but the logic below handles that by finding the longest match.
const pageRoles: { [key: string]: string[] } = {
  "/restaurant/create": ["admin"],
  "/dashboard": ["admin", "manager", "staff", "contractor", "supervisor"],
};

// Helper function to normalize strings for comparison
const normalize = (s: string) => s.trim().toLowerCase();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get user role from cookie
  const rawCookie = request.cookies.get("userRole")?.value ?? "";
  const userRole = normalize(decodeURIComponent(rawCookie));
  const isLoggedIn = !!userRole;

  // --- LOGIC FOR LOGGED-IN USERS ---
  if (isLoggedIn) {
    // If a logged-in user tries to access the root or login page, redirect to their dashboard.
    if (pathname === "/" || pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Check if the user is accessing a role-protected path
    const protectedPath = Object.keys(pageRoles)
      .sort((a, b) => b.length - a.length) // Sort to match more specific paths first
      .find((p) => pathname.startsWith(p));

    if (protectedPath) {
      const requiredRoles = pageRoles[protectedPath].map(normalize);
      // If the user's role is not in the list of required roles, redirect to unauthorized page.
      if (!requiredRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // If the user is logged in and has the correct role (or the path isn't protected), allow the request.
    return NextResponse.next();
  }

  // --- LOGIC FOR USERS WHO ARE NOT LOGGED-IN ---
  if (!isLoggedIn) {
    // Check if the requested path is protected.
    const isProtected = Object.keys(pageRoles).some((p) =>
      pathname.startsWith(p)
    );

    // If the path is protected, redirect the unauthenticated user to the root page.
    if (isProtected) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // *** FIX: This is the key change to prevent the redirect loop. ***
    // If the user is not logged in and the path is NOT protected (e.g., they are on "/" or "/about"),
    // we allow the request to proceed. We no longer redirect from "/" to "/".
    return NextResponse.next();
  }
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
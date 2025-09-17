import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const pageRoles: { [key: string]: string[] } = {
  "/restaurant/create": ["admin"],
  "/dashboard": ["admin", "manager", "staff", "contractor", "supervisor"],
};

const normalize = (s: string) => s.trim().toLowerCase();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieRole = request.cookies.get("userRole")?.value ?? "";
  const role = normalize(decodeURIComponent(cookieRole));
  const isLoggedIn = !!role;

  // Logged-in users
  if (isLoggedIn) {
    if (pathname === "/" || pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const protectedPath = Object.keys(pageRoles)
      .sort((a, b) => b.length - a.length)
      .find((p) => pathname.startsWith(p));

    if (protectedPath) {
      const allowedRoles = pageRoles[protectedPath].map(normalize);
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    return NextResponse.next();
  }

  // Not logged-in users
  const isProtected = Object.keys(pageRoles).some((p) =>
    pathname.startsWith(p)
  );

  if (isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

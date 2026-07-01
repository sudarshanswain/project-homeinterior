import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/gallery",
  "/blog",
  "/pricing",
  "/contact",
  "/book-consultation",
  "/login",
  "/register",
  "/forgot-password",
];

const PUBLIC_API_PREFIXES = ["/api/health", "/api/v1/auth"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/api/health")) return true;
  if (pathname.startsWith("/api/public")) return true;
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
    return true;
  if (
    pathname.startsWith("/portfolio/") ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/favicon")
  ) {
    return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Auth enforcement will be expanded in Phase 4
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
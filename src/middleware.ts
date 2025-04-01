import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Wrap the intl middleware with our custom auth logic
export async function middleware(request: NextRequest) {
  // No aplicar el middleware durante el login/registro y logout
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname === "/api/auth/logout"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  // Rutas protegidas
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);

      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      } else {
        return NextResponse.next();
      }
    } catch (err) {
      console.error("🚫 Token verification failed:", err);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Auth and admin routes
    "/admin/:path*",
    "/admin",
    "/",
    "/(es|en)/:path*",
  ],
};

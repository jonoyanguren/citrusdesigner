import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  console.log("🔒 Middleware - Path:", request.nextUrl.pathname);

  // No aplicar el middleware durante el login/registro
  if (request.nextUrl.pathname.startsWith("/auth")) {
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

      console.log("👤 Decoded token:", payload);

      if (payload.role !== "admin") {
        console.log("⛔ Not admin - Redirecting to home");
        return NextResponse.redirect(new URL("/", request.url));
      } else {
        console.log("👤 Admin - Redirecting to admin");
        return NextResponse.next();
      }
    } catch (err) {
      console.error("🚫 Token verification failed:", err);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};

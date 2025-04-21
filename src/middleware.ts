import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

// Utilidad segura para extraer el locale de la URL
function extractLocale(pathname: string): "es" | "en" {
  const first = pathname.split("/")[1];
  return ["es", "en"].includes(first) ? (first as "es" | "en") : "es";
}

// Middleware de internacionalización
const intlMiddleware = createMiddleware({
  ...routing,
  locales: ["es", "en"],
  defaultLocale: "es",
});

// Middleware principal con auth
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ⚠️ Corrige rutas mal generadas tipo /es/es/...
  if (pathname.startsWith("/es/es")) {
    return NextResponse.redirect(
      new URL("/es" + pathname.replace(/^\/es\/es/, ""), request.url)
    );
  }
  if (pathname.startsWith("/en/en")) {
    return NextResponse.redirect(
      new URL("/en" + pathname.replace(/^\/en\/en/, ""), request.url)
    );
  }

  // Saltar rutas de auth y logout
  if (pathname.startsWith("/auth") || pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  // Rutas protegidas
  if (pathname.match(/^\/(es|en)\/admin/)) {
    const locale = extractLocale(pathname);

    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);

      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.error("🚫 Token verification failed:", err);
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }
  }

  // Aplicar intlMiddleware a todo lo demás
  return intlMiddleware(request);
}

// Configuración para ignorar assets, API y archivos estáticos
export const config = {
  matcher: ["/((?!api|_next|.*\\..*|favicon.ico).*)"],
};

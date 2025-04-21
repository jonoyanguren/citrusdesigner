import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

// ✔️ Utilidad segura para extraer el locale actual desde la URL
function extractLocale(pathname: string): "es" | "en" {
  const first = pathname.split("/")[1];
  return ["es", "en"].includes(first) ? (first as "es" | "en") : "es";
}

// ✔️ Middleware de internacionalización
const intlMiddleware = createMiddleware({
  ...routing,
  locales: ["es", "en"],
  defaultLocale: "es",
});

// ✔️ Middleware principal
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ Redirecciones permanentes para evitar /es/es o /en/en
  if (pathname.startsWith("/es/es")) {
    return NextResponse.redirect(
      new URL("/es" + pathname.replace(/^\/es\/es/, ""), request.url),
      308
    );
  }
  if (pathname.startsWith("/en/en")) {
    return NextResponse.redirect(
      new URL("/en" + pathname.replace(/^\/en\/en/, ""), request.url),
      308
    );
  }

  // ✅ Evita aplicar el middleware en rutas de login/logout/API
  if (pathname.startsWith("/auth") || pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  // 🔒 Seguridad para rutas protegidas tipo /es/admin o /en/admin
  if (pathname.match(/^\/(es|en)\/admin/)) {
    const locale = extractLocale(pathname);
    const token = request.cookies.get("token")?.value;

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

  // 🌍 Aplica internacionalización a todo lo demás
  return intlMiddleware(request);
}

// ✔️ Configuración para ignorar rutas internas y archivos
export const config = {
  matcher: ["/((?!api|_next|.*\\..*|favicon.ico).*)"],
};

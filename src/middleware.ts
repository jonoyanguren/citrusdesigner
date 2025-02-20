import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // No aplicar el middleware durante el login/registro
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Verificar si la ruta comienza con /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      // Verificar si el usuario es admin
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
        headers: {
          Cookie: `auth_token=${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching user");
      }

      const user = await response.json();

      // Si no es admin, redirigir a dashboard
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Si es admin, permitir el acceso
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};

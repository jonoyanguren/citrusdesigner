import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return false;
    }

    if (!process.env.JWT_SECRET) {
      return false;
    }

    const decoded = verify(token, process.env.JWT_SECRET) as {
      userId: string;
      role: string;
    };

    // Verificar directamente por el rol en el token
    if (decoded.role === "admin") {
      return true;
    }

    // Verificación adicional en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    return user?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as {
      userId: string;
    };

    return await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

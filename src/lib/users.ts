"use server";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

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

export async function verifyToken(): Promise<
  | {
      userId: string;
      name: string;
      role: string;
      email: string;
    }
  | false
> {
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
    name: string;
    role: string;
    email: string;
  };
  return decoded;
}

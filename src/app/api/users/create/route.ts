import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, name, password, role, secretKey } = await request.json();

    // Verificar la clave secreta
    if (secretKey !== "maykatapaycaña") {
      return NextResponse.json(
        { error: "Clave secreta inválida" },
        { status: 401 }
      );
    }

    // Validar datos requeridos
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Crear o actualizar el usuario
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        password: hashedPassword,
        role: role || "user",
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role: role || "user",
      },
    });

    // No enviar la contraseña en la respuesta
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return NextResponse.json(
      {
        message: "Usuario creado/actualizado exitosamente",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando/actualizando usuario:", error);
    return NextResponse.json(
      { error: "Error al crear/actualizar el usuario" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

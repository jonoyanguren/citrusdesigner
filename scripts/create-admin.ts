import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL no está definido en el archivo .env");
  process.exit(1);
}

if (!process.env.ADMIN_PASSWORD) {
  console.error("Error: ADMIN_PASSWORD no está definido en el archivo .env");
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function createUser(
  email: string,
  name: string,
  password: string,
  role: "admin" | "user" = "user"
) {
  try {
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role,
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });

    console.info(`Usuario ${role} creado exitosamente:`, user.email);
    return user;
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
}

async function main() {
  try {
    // Crear usuario administrador
    await createUser(
      "acegarras@gmail.com",
      "Andrea",
      process.env.ADMIN_PASSWORD!,
      "admin"
    );

    // Aquí puedes agregar más usuarios si lo necesitas
    // await createUser("otro@email.com", "Otro Usuario", "contraseña123");
  } catch (error) {
    console.error("Error en el proceso:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

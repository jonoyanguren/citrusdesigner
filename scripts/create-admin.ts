const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");
require("dotenv").config();

const prisma = new PrismaClient();

if (!process.env.ADMIN_PASSWORD) {
  console.error("Error: ADMIN_PASSWORD no está definido en el archivo .env");
  process.exit(1);
}

async function main() {
  try {
    const hashedPassword = await hash(process.env.ADMIN_PASSWORD!, 10);

    const admin = await prisma.user.upsert({
      where: { email: "acegarras@gmail.com" },
      update: {
        role: "admin",
      },
      create: {
        email: "acegarras@gmail.com",
        name: "Andrea",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

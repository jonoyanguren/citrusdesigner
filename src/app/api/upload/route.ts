import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Asegurarnos de que el directorio existe
async function ensureDir() {
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDir(); // Crear el directorio si no existe

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validar el tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only images are allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Devolver la URL completa
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const fileUrl = `${baseUrl}/uploads/${fileName}`;

    return NextResponse.json({
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

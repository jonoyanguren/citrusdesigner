import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { emailTemplates } from "@/lib/email-templates";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, locale } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "El email es requerido" },
        { status: 400 }
      );
    }

    // Generar token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Actualizar usuario con el token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const { html, text, subject } =
      await emailTemplates.generatePasswordResetEmail({
        resetToken,
        locale,
      });
    await sendEmail({
      to: email,
      subject,
      html,
      text,
    });
    return NextResponse.json({ message: "Email enviado" });
  } catch (error) {
    console.error("Error en forgot password:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}

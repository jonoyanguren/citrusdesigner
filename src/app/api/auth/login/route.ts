import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      {
        headers: {
          "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

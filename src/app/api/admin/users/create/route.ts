import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/users";
import prisma from "@/lib/prisma";
import { hashSync } from "bcrypt";
import { randomBytes } from "crypto";
import { LocaleType } from "@/types/locale";
import { emailTemplates } from "@/lib/email-templates";
import { User } from "@prisma/client";
import { sendEmail } from "@/lib/email";

const sendWelcomeEmail = async (
  user: User,
  temporaryPassword: string,
  locale: LocaleType
) => {
  const { html, text, subject } = await emailTemplates.generateWelcomeEmail({
    userEmail: user.email,
    temporaryPassword,
    locale: locale as LocaleType,
  });

  await sendEmail({
    to: user.email,
    subject,
    html,
    text,
  });
};

export async function POST(request: NextRequest) {
  try {
    // Verify admin permissions
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse request body
    const {
      name,
      email,
      createSubscription,
      isAdmin: isAdminUser = false,
      password,
      locale = "en",
      subscriptionPrice = "49.99",
    } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // If subscription is selected, validate price
    if (createSubscription) {
      const price = parseFloat(subscriptionPrice);
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: "Invalid subscription price" },
          { status: 400 }
        );
      }
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Generate random password for non-admin users, use provided password for admins
    const userPassword = isAdminUser
      ? password
      : randomBytes(8).toString("hex");

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(userPassword, 10),
        hasToChangePassword: !isAdminUser,
        role: isAdminUser ? "admin" : "user",
      },
    });

    // Create manual subscription if requested and not admin
    if (createSubscription && !isAdminUser) {
      await prisma.manualSubscription.create({
        data: {
          userId: user.id,
          price: parseFloat(subscriptionPrice),
          status: "active",
        },
      });
    }

    // Send welcome email with temporary password in the specified locale
    try {
      await sendWelcomeEmail(user, userPassword, locale as LocaleType);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        temporaryPassword: userPassword,
        locale,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emailTemplates } from "@/lib/email-templates";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { email },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Email already in waitlist" },
        { status: 400 }
      );
    }

    const waitlistEntry = await prisma.waitlistEntry.create({
      data: { email },
    });

    const { html, text, subject } = emailTemplates.generateWaitingListEmail({
      userEmail: email,
    });

    await sendEmail({
      to: email,
      subject,
      html,
      text,
    });

    return NextResponse.json({
      message: "Successfully added to waitlist",
      entry: waitlistEntry,
    });
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return NextResponse.json(
      { error: "Error adding to waitlist" },
      { status: 500 }
    );
  }
}

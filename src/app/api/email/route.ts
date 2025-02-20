import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, text, html } = body;

    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: "Required fields: to, subject, text" },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to,
      subject,
      text,
      html: html || text,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Error sending email" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

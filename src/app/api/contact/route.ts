import React from "react";

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

// Component
import EmailTemplate from "@/components/email-template";

import { z } from "zod";

// Define your Zod schema for validation
const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Hmm... That doesn't look like Email"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(2, "Message must be at least 2 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ✅ Verify Turnstile token
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: body.token,
      }),
    });

    const data = await verifyRes.json();
    
    if (!data.success) {
      return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
    }
    
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error.format());
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { fullName, email, subject, message } = parsed.data;
    if (!fullName || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // ✅ Render Email
    const emailHtml = await render(
      React.createElement(EmailTemplate, { fullName, email, subject, message })
    );

    // ✅ Nodemailer Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // ✅ Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: subject,
      html: emailHtml,
    });
    
    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, message: "Failed to send email." }, { status: 500 });
  }
}
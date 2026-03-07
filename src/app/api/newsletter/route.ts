import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  _hp: z.literal("").optional(),
});

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "hello@sector7gym.in";
const FROM_EMAIL         = process.env.FROM_EMAIL         ?? "SEC7OR Fitness <noreply@sector7gym.in>";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ success: false, errors: result.error.issues }, { status: 400 });
  }

  const { email, _hp } = result.data;
  if (_hp) return NextResponse.json({ success: true });

  try {
    const resend = getResend();
    // Notify staff of new subscriber
    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      NOTIFICATION_EMAIL,
      subject: `[SEC7OR] New Newsletter Signup — ${email}`,
      html: `<p>New newsletter signup: <strong>${email}</strong></p><p style="color:#999;font-size:12px">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>`,
    });

    // Welcome email to subscriber
    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      email,
      subject: "You're in — SEC7OR Fitness Newsletter",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="color:#FF5500">Welcome to the SEC7OR community!</h2>
          <p>You'll hear from us when we publish new training tips, run promotions, or have something worth reading.</p>
          <p>No spam. Unsubscribe anytime.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
          <p style="color:#999;font-size:12px">SEC7OR Fitness — Gym & CrossFit, Kochi, Kerala</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Subscribed successfully." });
  } catch (err) {
    console.error("[/api/newsletter] Resend error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

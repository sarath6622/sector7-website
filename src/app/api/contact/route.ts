import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Lazy init — avoids build-time crash when RESEND_API_KEY is not set
function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  enquiryType: z.enum(["membership", "personal-training", "corporate", "general"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(500),
  _hp: z.literal("").optional(),
});

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "hello@sector7gym.in";
const FROM_EMAIL         = process.env.FROM_EMAIL         ?? "SEC7OR Fitness <noreply@sector7gym.in>";

const ENQUIRY_LABELS: Record<string, string> = {
  "membership":        "Membership",
  "personal-training": "Personal Training",
  "corporate":         "Corporate Wellness",
  "general":           "General Enquiry",
};

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Parse + validate
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

  const { name, phone, email, enquiryType, message, _hp } = result.data;

  // Honeypot check
  if (_hp) {
    return NextResponse.json({ success: true, message: "Message received." });
  }

  const enquiryLabel = ENQUIRY_LABELS[enquiryType] ?? enquiryType;

  try {
    const resend = getResend();
    // Notify gym staff
    await resend.emails.send({
      from: FROM_EMAIL,
      to:   NOTIFICATION_EMAIL,
      subject: `[SEC7OR] New Contact Enquiry — ${enquiryLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="color:#FF5500;margin-bottom:4px">New Contact Enquiry</h2>
          <p style="color:#666;margin-top:0">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:140px">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Phone</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${phone}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee">${email || "—"}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Enquiry Type</td><td style="padding:8px 0;border-bottom:1px solid #eee">${enquiryLabel}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9f9f9;border-left:3px solid #FF5500">
            <p style="margin:0;white-space:pre-line">${message}</p>
          </div>
          <p style="color:#999;font-size:12px;margin-top:24px">Submitted from the SEC7OR website contact form.</p>
        </div>
      `,
    });

    // Auto-reply to user if email provided
    if (email) {
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      email,
        subject: "We got your message — SEC7OR Fitness",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
            <h2 style="color:#FF5500">Thanks, ${name}!</h2>
            <p>We've received your enquiry about <strong>${enquiryLabel}</strong> and will get back to you within 24 hours.</p>
            <p>In the meantime, feel free to WhatsApp us directly at <strong>+91 9539108642</strong>.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
            <p style="color:#999;font-size:12px">SEC7OR Fitness — Gym & CrossFit, Kochi, Kerala</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("[/api/contact] Resend error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

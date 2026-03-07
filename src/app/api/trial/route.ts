import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  timeSlot: z.enum(["early-morning", "morning", "afternoon", "evening"]),
  goal: z.enum(["weight-loss", "muscle-gain", "general-fitness", "crossfit", "other"]),
  referral: z.string().optional(),
  _hp: z.literal("").optional(),
});

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "hello@sector7gym.in";
const FROM_EMAIL         = process.env.FROM_EMAIL         ?? "SEC7OR Fitness <noreply@sector7gym.in>";

const TIME_LABELS: Record<string, string> = {
  "early-morning": "Early Morning (5–7 AM)",
  "morning":       "Morning (7–11 AM)",
  "afternoon":     "Afternoon (11 AM–5 PM)",
  "evening":       "Evening (5–10 PM)",
};

const GOAL_LABELS: Record<string, string> = {
  "weight-loss":     "Weight Loss",
  "muscle-gain":     "Muscle Gain",
  "general-fitness": "General Fitness",
  "crossfit":        "CrossFit Training",
  "other":           "Other",
};

const REFERRAL_LABELS: Record<string, string> = {
  "instagram":  "Instagram",
  "facebook":   "Facebook",
  "google":     "Google Search",
  "friend":     "Friend / Family",
  "walked-by":  "Walked Past the Gym",
  "other":      "Other",
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

  const { name, phone, email, preferredDate, timeSlot, goal, referral, _hp } = result.data;

  // Honeypot check
  if (_hp) {
    return NextResponse.json({ success: true, message: "Booking received." });
  }

  const timeLabel    = TIME_LABELS[timeSlot] ?? timeSlot;
  const goalLabel    = GOAL_LABELS[goal]     ?? goal;
  const referralLabel = referral ? (REFERRAL_LABELS[referral] ?? referral) : "—";

  const formattedDate = new Date(preferredDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const waLink = buildWhatsAppURL({ message: WA_MESSAGES.trialConfirmation(formattedDate), source: "trial-confirmation" });

  try {
    const resend = getResend();
    // Notify gym staff
    await resend.emails.send({
      from: FROM_EMAIL,
      to:   NOTIFICATION_EMAIL,
      subject: `[SEC7OR] New Free Trial Booking — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="color:#FF5500;margin-bottom:4px">New Free Trial Booking</h2>
          <p style="color:#666;margin-top:0">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:140px">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Phone</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600"><a href="tel:+91${phone}">${phone}</a></td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee">${email || "—"}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Date</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${formattedDate}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Time Slot</td><td style="padding:8px 0;border-bottom:1px solid #eee">${timeLabel}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Goal</td><td style="padding:8px 0;border-bottom:1px solid #eee">${goalLabel}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Referred by</td><td style="padding:8px 0;border-bottom:1px solid #eee">${referralLabel}</td></tr>
          </table>
          <p style="color:#999;font-size:12px;margin-top:24px">Submitted from the SEC7OR website free trial form.</p>
        </div>
      `,
    });

    // Confirmation email to user if email provided
    if (email) {
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      email,
        subject: "Your free trial is booked — SEC7OR Fitness",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
            <h2 style="color:#FF5500">You're on the list, ${name}!</h2>
            <p>We've received your free trial booking. Here are your details:</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:120px">Date</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">${formattedDate}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Time</td><td style="padding:8px 0;border-bottom:1px solid #eee">${timeLabel}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666">Goal</td><td style="padding:8px 0;border-bottom:1px solid #eee">${goalLabel}</td></tr>
            </table>
            <p>We'll call you within 2 hours to confirm your slot. To reach us directly:</p>
            <p><a href="${waLink}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;text-decoration:none;font-weight:600;border-radius:4px">Chat on WhatsApp</a></p>
            <p style="color:#666;font-size:13px">What to bring: comfortable workout clothes and water. No equipment needed — we have everything.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
            <p style="color:#999;font-size:12px">SEC7OR Fitness — Gym & CrossFit, Kochi, Kerala</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: "Free trial booked successfully." });
  } catch (err) {
    console.error("[/api/trial] Resend error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to process booking. Please try again." },
      { status: 500 }
    );
  }
}

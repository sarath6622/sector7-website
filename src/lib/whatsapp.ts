import type { WhatsAppOptions } from "@/types";

/**
 * Build a WhatsApp click-to-chat URL with a contextual prefilled message.
 * All WhatsApp links MUST use this function — never construct URLs manually.
 */
export function buildWhatsAppURL({ phone, message, source }: WhatsAppOptions): string {
  const number = phone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${number}?text=${encodedMessage}`;

  // Source param is for analytics tracking only — not included in URL
  void source;

  return url;
}

/**
 * Predefined messages for each WhatsApp touchpoint.
 * Keep these in sync with the spec (Section 5.3).
 */
export const WA_MESSAGES = {
  fab: "Hi! I'm interested in Sector 7. Can you share details?",
  hero: "Hi! I'd like to know about membership plans at Sector 7.",
  pricing: (planName: string) =>
    `Hi! I'd like to know about the ${planName} membership at Sector 7.`,
  trainer: (trainerName: string) =>
    `Hi! I'm interested in personal training with ${trainerName} at Sector 7.`,
  contact: "Hi! I'd like to visit Sector 7. Can I get directions and timing?",
  trialConfirmation: (date: string) =>
    `Hi! I just booked a free trial at Sector 7 for ${date}. Please confirm.`,
  blog: (articleTitle: string) =>
    `Hi! I read your article on "${articleTitle}". I'd like to know more about training at Sector 7.`,
  afterHours: "Hi! I'm trying to reach Sector 7 outside business hours. Please get back to me.",
  trialBooking: (details: {
    name: string;
    phone: string;
    date: string;
    timeSlot: string;
    goal: string;
  }) =>
    `Hi! I'd like to book a free trial at Sector 7.\n\nName: ${details.name}\nPhone: ${details.phone}\nPreferred Date: ${details.date}\nTime Slot: ${details.timeSlot}\nGoal: ${details.goal}`,
} as const;

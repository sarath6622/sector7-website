"use client";

/**
 * Google Analytics 4 event helper.
 * All GA4 events in this project MUST use this function — never call gtag directly.
 *
 * Requires GA4 script to be loaded in the root layout.
 * See: https://developers.google.com/analytics/devguides/collection/ga4
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (!("gtag" in window)) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag("event", eventName, parameters);
}

/**
 * Pre-defined GA4 events — use these constants to avoid typos.
 */
export const GA_EVENTS = {
  whatsappClick:        "whatsapp_click",
  ctaClick:             "cta_click",
  trialFormStart:       "trial_form_start",
  trialFormSubmit:      "trial_form_submit",
  contactFormSubmit:    "contact_form_submit",
  newsletterSignup:     "newsletter_signup",
  blogRead:             "blog_read",
  transformationView:   "transformation_view",
  trainerProfileView:   "trainer_profile_view",
  directionClick:       "direction_click",
  callClick:            "call_click",
  scrollDepth:          "scroll_depth",
} as const;

export type GAEventName = (typeof GA_EVENTS)[keyof typeof GA_EVENTS];

import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";
import { generateMetadata as buildMetadata, generateBreadcrumbJSONLD } from "@/lib/seo";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = buildMetadata({
  title: "Contact SEC7OR Fitness Kochi — Visit or Call",
  description:
    "Get in touch with SEC7OR Fitness Kochi. Call, WhatsApp, or fill in the form — we respond within 24 hours.",
  path: "/contact",
});

// ── Fallbacks when Sanity has no data ────────────────────────────────────────
const FALLBACK = {
  phone: "+91 XX XXXX XXXX",
  email: "info@sector7gym.com",
  address: "near Infopark Expressway, Chittethukara,\nKakkanad, Kerala 682037",
  operatingHours: [
    { day: "Monday",    open: "5:00 AM", close: "11:00 PM" },
    { day: "Tuesday",   open: "5:00 AM", close: "11:00 PM" },
    { day: "Wednesday", open: "5:00 AM", close: "11:00 PM" },
    { day: "Thursday",  open: "5:00 AM", close: "11:00 PM" },
    { day: "Friday",    open: "5:00 AM", close: "11:00 PM" },
    { day: "Saturday",  open: "5:00 AM", close: "11:00 PM" },
    { day: "Sunday",    open: "6:00 AM", close: "9:00 PM"  },
  ],
  socialLinks: {
    instagram: "https://www.instagram.com/sector7fitness.kochi",
    facebook: "",
    youtube: "",
  },
  googleMapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.2413858602613!2d76.35285449999999!3d9.996908999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080dfe7100f617%3A0x461c550e46be033a!2sSector%207!5e0!3m2!1sen!2sin!4v1772881494882!5m2!1sen!2sin",
};

// ── Types ────────────────────────────────────────────────────────────────────
interface SiteSettings {
  phone?: string;
  email?: string;
  address?: string;
  operatingHours?: { day: string; open: string; close: string }[];
  socialLinks?: { instagram?: string; facebook?: string; youtube?: string };
  googleMapsEmbedSrc?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7.in";
const breadcrumbLD = generateBreadcrumbJSONLD([
  { name: "Home", url: SITE_URL },
  { name: "Contact", url: `${SITE_URL}/contact` },
]);

const SOCIAL_ICONS = [
  { key: "instagram" as const, label: "Instagram", icon: Instagram },
  { key: "facebook" as const,  label: "Facebook",  icon: Facebook },
  { key: "youtube" as const,   label: "YouTube",   icon: Youtube },
];

function getTodayIndex() {
  return new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function ContactPage() {
  let settings: SiteSettings = {};

  if (isSanityConfigured) {
    try {
      settings = (await sanityClient.fetch<SiteSettings>(SITE_SETTINGS_QUERY)) ?? {};
    } catch { /* fall through to fallbacks */ }
  }

  const phone = settings.phone || FALLBACK.phone;
  const email = settings.email || FALLBACK.email;
  const address = settings.address || FALLBACK.address;
  const hours = settings.operatingHours?.length ? settings.operatingHours : FALLBACK.operatingHours;
  const social = { ...FALLBACK.socialLinks, ...settings.socialLinks };
  const mapSrc = settings.googleMapsEmbedSrc || FALLBACK.googleMapsEmbedSrc;

  // Determine today's day name for highlighting
  const todayName = DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  // Build phone href (strip spaces/dashes for tel: link)
  const phoneHref = `tel:${phone.replace(/[\s\-()]/g, "")}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLD }} />
      <PageHero
        label="Get in Touch"
        heading="Contact <em>Us</em>"
        subtitle="Questions about membership, personal training, or just want to see the gym? We're happy to help."
      />

      <section className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info column */}
          <div className="flex flex-col gap-10">
            {/* Contact details */}
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-2xl tracking-wide text-white uppercase">
                Find Us
              </h2>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <address className="font-body text-white/75 text-sm leading-relaxed not-italic whitespace-pre-line">
                  {address}
                </address>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <a
                  href={phoneHref}
                  className="font-body text-white/75 text-sm hover:text-accent transition-colors"
                >
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="font-body text-white/75 text-sm hover:text-accent transition-colors"
                >
                  {email}
                </a>
              </div>

              <a
                href={buildWhatsAppURL({
                  message: WA_MESSAGES.contact,
                  source: "contact-page",
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold tracking-wider uppercase py-3 px-5 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors self-start"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-2xl tracking-wide text-white uppercase flex items-center gap-2">
                <Clock size={18} className="text-accent" />
                Operating Hours
              </h2>
              <div className="border border-border">
                {hours.map((h, i) => {
                  const isToday = h.day === todayName;
                  return (
                    <div
                      key={h.day}
                      className={`flex items-center justify-between px-4 py-3 font-body text-sm ${
                        i < hours.length - 1 ? "border-b border-border" : ""
                      } ${isToday ? "border-l-2 border-l-accent bg-accent/5" : ""}`}
                    >
                      <span className={isToday ? "text-white font-semibold" : "text-white/70"}>
                        {h.day}
                        {isToday && (
                          <span className="text-accent text-xs ml-2 font-medium">Today</span>
                        )}
                      </span>
                      <span className={isToday ? "text-accent font-semibold" : "text-white font-medium"}>
                        {h.open} – {h.close}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className="border border-border overflow-hidden" style={{ height: "260px" }}>
              <iframe
                src={mapSrc}
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SEC7OR Fitness on Google Maps"
              />
            </div>

            {/* Social */}
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-xl tracking-wide text-white uppercase">
                Follow Us
              </h2>
              <div className="flex gap-3">
                {SOCIAL_ICONS.map(({ key, label, icon: Icon }) => {
                  const href = social[key];
                  if (!href) return null;
                  return (
                    <a
                      key={key}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center border border-border text-muted hover:border-accent hover:text-accent transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl tracking-wide text-white uppercase">
              Send a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

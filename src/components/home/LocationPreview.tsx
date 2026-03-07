"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";
import { getTodayDayName } from "@/lib/utils";

interface HoursRow {
  day: string;
  open: string;
  close: string;
}

const HOURS: HoursRow[] = [
  { day: "Monday",    open: "5:00 AM",  close: "11:00 PM" },
  { day: "Tuesday",   open: "5:00 AM",  close: "11:00 PM" },
  { day: "Wednesday", open: "5:00 AM",  close: "11:00 PM" },
  { day: "Thursday",  open: "5:00 AM",  close: "11:00 PM" },
  { day: "Friday",    open: "5:00 AM",  close: "11:00 PM" },
  { day: "Saturday",  open: "5:00 AM",  close: "11:00 PM" },
  { day: "Sunday",    open: "6:00 AM",  close: "9:00 PM"  },
];

/**
 * LocationPreview — split layout: Google Maps embed + contact info + hours.
 * "use client" only to highlight today's row with getTodayDayName().
 *
 * TODO: Paste your Google Maps embed src into the <iframe> below.
 *   Get it from: Google Maps → Share → Embed a map → Copy HTML
 *   Extract the `src` attribute from the <iframe> tag.
 */
export function LocationPreview() {
  const today = getTodayDayName();

  return (
    <section className="py-20 md:py-28 bg-bg-primary">
      <div className="container-section flex flex-col gap-12">
        <SectionHeading
          label="Find Us"
          heading="Visit <em>SEC7OR</em>"
          subtitle="Conveniently located in Kochi, Kerala. Walk in any day — your first session is on us."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── Map ── */}
          <div
            className="relative bg-surface border border-border overflow-hidden"
            style={{ minHeight: "420px" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.2413858602613!2d76.35285449999999!3d9.996908999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080dfe7100f617%3A0x461c550e46be033a!2sSector%207!5e0!3m2!1sen!2sin!4v1772881494882!5m2!1sen!2sin"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SEC7OR Fitness location on Google Maps"
            />
          </div>

          {/* ── Info block ── */}
          <div className="flex flex-col gap-8">
            {/* Contact details */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="text-accent mt-0.5 flex-shrink-0"
                />
                <address className="font-body text-white/75 text-sm leading-relaxed not-italic">
                  {/* TODO: Replace with actual address */}
                  Your Street, Area Name
                  <br />
                  Kochi, Kerala — 682&thinsp;0XX
                </address>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={17} className="text-accent flex-shrink-0" />
                {/* TODO: Replace with actual phone number */}
                <a
                  href="tel:+919XXXXXXXXX"
                  className="font-body text-white/75 text-sm hover:text-accent transition-colors"
                >
                  +91 9X XXXX XXXX
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-accent flex-shrink-0" />
                {/* TODO: Replace with actual email */}
                <a
                  href="mailto:info@sec7or.com"
                  className="font-body text-white/75 text-sm hover:text-accent transition-colors"
                >
                  info@sec7or.com
                </a>
              </div>
            </div>

            {/* Operating hours */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={15} className="text-accent" />
                <span className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-muted">
                  Operating Hours
                </span>
              </div>
              <div className="border border-border">
                {HOURS.map((h, i) => {
                  const isToday = h.day === today;
                  return (
                    <div
                      key={h.day}
                      className={[
                        "flex items-center justify-between px-4 py-2.5 font-body text-sm",
                        isToday ? "bg-accent/10 border-l-2 border-l-accent" : "",
                        i < HOURS.length - 1 ? "border-b border-border" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span
                        className={
                          isToday ? "text-white font-medium" : "text-white/55"
                        }
                      >
                        {h.day}
                        {isToday && (
                          <span className="ml-2 text-xs text-accent font-semibold">
                            Today
                          </span>
                        )}
                      </span>
                      <span
                        className={
                          isToday
                            ? "text-accent font-semibold"
                            : "text-white/55"
                        }
                      >
                        {h.open} – {h.close}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" href="/contact">
                Contact Us
              </Button>
              <Button
                variant="whatsapp"
                href={buildWhatsAppURL({
                  message: WA_MESSAGES.contact,
                  source: "location-preview",
                })}
                external
              >
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

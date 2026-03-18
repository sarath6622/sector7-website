import Link from "next/link";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";

const QUICK_LINKS = [
  { label: "Facilities",      href: "/facilities" },
  { label: "Trainers",        href: "/trainers" },
  { label: "Transformations", href: "/transformations" },
  { label: "About",           href: "/about" },
  { label: "Blog",            href: "/blog" },
  { label: "Pricing",         href: "/pricing" },
  { label: "Contact",         href: "/contact" },
  { label: "Book Free Trial", href: "/free-trial" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const waHref = buildWhatsAppURL({ message: WA_MESSAGES.contact, source: "footer" });

  return (
    <footer className="bg-bg-secondary border-t border-border" aria-label="Site footer">
      <div className="container-section py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* ─── Col 1: Brand ───────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="SEC7OR Fitness — home">
              <Logo variant="full" />
            </Link>
            <p className="text-muted font-body text-sm leading-relaxed mb-6 max-w-xs">
              Military-grade discipline. Industrial strength. Elite performance.
              Kochi&apos;s most serious gym — built for those who are serious about results.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/sector7fitness.kochi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors p-1"
                aria-label="Sector 7 on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors p-1"
                aria-label="Sector 7 on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors p-1"
                aria-label="Sector 7 on YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* ─── Col 2: Quick Links ──────────────────────────────────────── */}
          <div>
            <h3 className="font-display text-xl tracking-widest text-white mb-6">
              QUICK LINKS
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-white font-body text-sm transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Col 3: Contact ──────────────────────────────────────────── */}
          <div>
            <h3 className="font-display text-xl tracking-widest text-white mb-6">
              FIND US
            </h3>
            <ul className="flex flex-col gap-4" role="list">
              <li className="flex gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                <address className="text-muted font-body text-sm not-italic leading-relaxed">
                  Sector 7 Gym<br />
                  {/* Replace with actual address from Sanity siteSettings */}
                  Kochi, Kerala, India
                </address>
              </li>
              <li>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="flex gap-3 text-muted hover:text-white font-body text-sm transition-colors group"
                  aria-label="Call Sector 7"
                >
                  <Phone size={16} className="text-accent flex-shrink-0 mt-0.5 group-hover:text-white transition-colors" aria-hidden="true" />
                  <span>+91 XX XXXX XXXX</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@sector7gym.com"
                  className="flex gap-3 text-muted hover:text-white font-body text-sm transition-colors group"
                  aria-label="Email Sector 7"
                >
                  <Mail size={16} className="text-accent flex-shrink-0 mt-0.5 group-hover:text-white transition-colors" aria-hidden="true" />
                  <span>info@sector7gym.com</span>
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="font-body text-sm">
                  <span className="text-white font-medium">Mon – Sun</span>
                  <br />
                  <span className="text-muted">5:00 AM – 11:00 PM</span>
                </div>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-border hover:border-whatsapp text-muted hover:text-whatsapp font-body text-sm px-4 py-2.5 transition-colors"
              aria-label="Chat with Sector 7 on WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with us
            </a>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ──────────────────────────────────────────────────── */}
      <div className="border-t border-border">
        <div className="container-section py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted font-body text-xs">
            © {currentYear} Sector 7 Gym. All rights reserved.
          </p>
          <p className="text-muted/50 font-body text-xs">
            Built with precision. No stock photo energy.
          </p>
        </div>
      </div>
    </footer>
  );
}

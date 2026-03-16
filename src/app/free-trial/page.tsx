import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Shield, Clock, Star } from "lucide-react";
import { FreeTrialForm } from "@/components/forms/FreeTrialForm";
import { generateMetadata as buildMetadata, generateBreadcrumbJSONLD } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Book a Free Gym Trial in Kochi — SEC7OR Fitness",
  description:
    "Book your free trial session at SEC7OR Fitness Kochi. No commitment, no credit card. Just show up and train.",
  path: "/free-trial",
  keywords: [
    "free gym trial Kochi", "try gym free Kochi", "free fitness trial Kochi",
    "join gym Kochi", "gym free session Kochi",
  ],
});

const TRUST_POINTS = [
  { icon: CheckCircle2, text: "No credit card required" },
  { icon: Shield,       text: "Zero commitment — cancel anytime" },
  { icon: Clock,        text: "60-minute guided session" },
  { icon: Star,         text: "Rated 4.8 ★ by 600+ members" },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7.in";
const breadcrumbLD = generateBreadcrumbJSONLD([
  { name: "Home", url: SITE_URL },
  { name: "Free Trial", url: `${SITE_URL}/free-trial` },
]);

export default function FreeTrialPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbLD }} />
      <div className="min-h-screen bg-bg-primary">
      {/* Minimal top bar */}
      <div className="fixed top-0 inset-x-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
        <div className="container-section flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-body text-sm text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            Back to site
          </Link>

          {/* Inline logo */}
          <span className="font-display text-xl tracking-[0.15em] text-white uppercase">
            SEC<span className="text-accent">7</span>OR
          </span>

          {/* Spacer for symmetry */}
          <div className="w-24" />
        </div>
      </div>

      <div className="pt-24 pb-20">
        <div className="container-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — persuasion column */}
            <div className="flex flex-col gap-10 lg:sticky lg:top-28">
              <div className="flex flex-col gap-4">
                <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent">
                  Free — No Obligation
                </span>
                <h1 className="font-display text-5xl md:text-6xl tracking-wide text-white uppercase leading-none">
                  Your First<br />
                  Session Is<br />
                  <em className="not-italic text-accent">On Us</em>
                </h1>
                <p className="font-body text-white/65 text-base leading-relaxed max-w-md">
                  Walk in, train with a certified coach, see every facility zone. No sales pitch.
                  If SEC7OR isn't right for you, we'll say so ourselves.
                </p>
              </div>

              {/* Trust points */}
              <ul className="flex flex-col gap-3">
                {TRUST_POINTS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 font-body text-sm text-white/70">
                    <Icon size={16} className="text-accent flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>

              {/* What to expect */}
              <div className="border border-border p-6 flex flex-col gap-4">
                <h2 className="font-display text-xl tracking-wide text-white uppercase">
                  What Happens Next
                </h2>
                <ol className="flex flex-col gap-3">
                  {[
                    "We confirm your slot via WhatsApp within 2 hours.",
                    "Show up at SEC7OR at your chosen time. Wear comfortable workout clothes.",
                    "A coach takes you through the facility, assesses your fitness level, and runs a tailored 60-min session.",
                    "After the session, we'll discuss membership options — only if you want to.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm text-white/60">
                      <span className="font-mono text-accent font-bold text-xs mt-0.5 flex-shrink-0">
                        0{i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Social proof quote */}
              <blockquote className="border-l-2 border-accent pl-4">
                <p className="font-body text-sm text-white/55 italic leading-relaxed">
                  "I booked a free trial with zero intention of joining. Left as a member. The facility
                  and the trainers are genuinely on a different level."
                </p>
                <footer className="font-body text-xs text-muted mt-2">
                  — Aditya R., Pro member since 2023
                </footer>
              </blockquote>
            </div>

            {/* Right — form column */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-display text-2xl tracking-wide text-white uppercase">
                  Book Your Session
                </h2>
                <p className="font-body text-sm text-muted mt-1">
                  Fill in the form — we'll confirm via WhatsApp.
                </p>
              </div>
              <FreeTrialForm />
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  );
}

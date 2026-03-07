import type { Metadata } from "next";
import { CheckCircle2, X } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { CTABanner } from "@/components/home/CTABanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FAQAccordion, type FAQItem } from "@/components/pricing/FAQAccordion";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { ALL_PRICING_PLANS_QUERY, FAQS_QUERY } from "@/lib/sanity/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pricing — SEC7OR Fitness",
  description:
    "SEC7OR Fitness membership plans starting at ₹1,499/month. Starter, Pro, and Elite options for every fitness goal in Kochi.",
};

// ── Sanity types ─────────────────────────────────────────────────────────────
interface SanityPlan {
  _id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  features: string[];
  notIncluded?: string[];
  badge?: string;
  isHighlighted: boolean;
  order: number;
}

// ── Static fallbacks ──────────────────────────────────────────────────────────
interface Plan {
  name: string;
  price: number;
  billing: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  highlight: boolean;
  badge?: string;
}

const STATIC_PLANS: Plan[] = [
  {
    name: "Starter",
    price: 1499,
    billing: "per month",
    description: "Full gym access to build your foundation.",
    features: [
      "Unlimited gym access (5 AM – 11 PM)",
      "All training zones (Strength, Cardio, CrossFit, Functional)",
      "Locker & changing rooms",
      "1 complimentary fitness assessment",
      "Access to group cardio classes",
      "App-based workout logging",
    ],
    notIncluded: ["Personal training sessions", "Nutrition consultation"],
    highlight: false,
  },
  {
    name: "Pro",
    price: 2499,
    billing: "per month",
    description: "Guided coaching for serious progress.",
    features: [
      "Everything in Starter",
      "4 personal training sessions / month",
      "Monthly nutrition consultation",
      "Custom workout programme",
      "WhatsApp coach access",
      "Priority equipment reservation",
      "Monthly progress tracking",
    ],
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Elite",
    price: 3999,
    billing: "per month",
    description: "Unlimited coaching for maximum results.",
    features: [
      "Everything in Pro",
      "Unlimited personal training sessions",
      "Weekly nutrition check-ins",
      "Dedicated coach (same trainer every session)",
      "Recovery room access",
      "Guest passes (2/month)",
      "Priority scheduling",
      "Quarterly body composition scan",
    ],
    highlight: false,
  },
];

const STATIC_FAQS: FAQItem[] = [
  {
    question: "Is there a joining fee?",
    answer:
      "No joining fees, no registration charges, no hidden costs. You pay only the monthly membership amount. We believe in transparent pricing.",
  },
  {
    question: "Can I cancel my membership anytime?",
    answer:
      "Yes. All memberships are month-to-month with no long-term lock-in. Cancel with 7 days' notice before your next billing date — no questions asked.",
  },
  {
    question: "Do you offer student or corporate discounts?",
    answer:
      "Yes — students with valid ID receive a 15% discount on any plan. Corporate wellness packages for teams of 5+ are available at negotiated rates. Contact us for details.",
  },
  {
    question: "Can I freeze my membership?",
    answer:
      "Pro and Elite members can freeze their membership for up to 30 days per year (e.g., for travel or illness) without losing their billing cycle.",
  },
  {
    question: "What happens in a personal training session?",
    answer:
      "Your first session is always an assessment — we evaluate your current fitness, movement patterns, and goals. Subsequent sessions follow a structured programme built specifically for you. Sessions are 60 minutes.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "Absolutely. You can upgrade at any time (effective immediately) or downgrade at the end of your current billing cycle.",
  },
];

export default async function PricingPage() {
  // ── Fetch from Sanity ───────────────────────────────────────────────────────
  let sanityPlans: SanityPlan[] | null = null;
  let sanityFaqs: { question: string; answer: string }[] | null = null;

  if (isSanityConfigured) {
    try {
      sanityPlans = await sanityClient.fetch(ALL_PRICING_PLANS_QUERY);
    } catch { /* fall through */ }
    try {
      const result = await sanityClient.fetch<{ faqs?: { question: string; answer: string }[] } | null>(FAQS_QUERY);
      sanityFaqs = result?.faqs ?? null;
    } catch { /* fall through */ }
  }

  // ── Build display data ──────────────────────────────────────────────────────
  interface DisplayPlan {
    key: string;
    name: string;
    price: number;
    billing: string;
    description: string;
    features: string[];
    notIncluded?: string[];
    highlight: boolean;
    badge?: string;
  }

  const plans: DisplayPlan[] = sanityPlans?.length
    ? sanityPlans.map((p) => ({
      key: p._id,
      name: p.name,
      price: p.monthlyPrice,
      billing: "per month",
      description: p.description,
      features: p.features ?? [],
      notIncluded: p.notIncluded,
      highlight: p.isHighlighted,
      badge: p.badge,
    }))
    : STATIC_PLANS.map((p) => ({
      key: p.name,
      name: p.name,
      price: p.price,
      billing: p.billing,
      description: p.description,
      features: p.features,
      notIncluded: p.notIncluded,
      highlight: p.highlight,
      badge: p.badge,
    }));

  const faqs: FAQItem[] = sanityFaqs?.length
    ? sanityFaqs.map((f) => ({ question: f.question, answer: f.answer }))
    : STATIC_FAQS;

  return (
    <>
      <PageHero
        label="Membership Plans"
        heading="Choose Your <em>Plan</em>"
        subtitle="Transparent pricing, no lock-ins, no hidden fees. Your first session is always free."
      />

      {/* Plans */}
      <section className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section flex flex-col gap-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={`relative flex flex-col gap-6 p-7 border ${plan.highlight
                    ? "border-accent bg-accent/5"
                    : "border-border bg-surface"
                  }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white font-body text-xs font-semibold px-3 py-1 tracking-wider uppercase whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h2 className="font-display text-3xl tracking-wide text-white uppercase mb-1">
                    {plan.name}
                  </h2>
                  <p className="font-body text-sm text-muted">{plan.description}</p>
                </div>

                <div>
                  <span className="font-display text-5xl text-white leading-none">
                    ₹{plan.price.toLocaleString("en-IN")}
                  </span>
                  <span className="font-body text-sm text-muted ml-2">
                    {plan.billing}
                  </span>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 font-body text-sm text-white/80">
                      <CheckCircle2 size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded?.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 font-body text-sm text-muted">
                      <X size={14} className="mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2 mt-auto pt-2">
                  <Button
                    variant={plan.highlight ? "primary" : "ghost"}
                    href="/free-trial"
                    className="w-full justify-center"
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="whatsapp"
                    href={buildWhatsAppURL({
                      message: WA_MESSAGES.pricing(plan.name),
                      source: `pricing-${plan.name.toLowerCase()}`,
                    })}
                    external
                    className="w-full justify-center"
                  >
                    Ask on WhatsApp
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
            <SectionHeading
              label="Common Questions"
              heading="FAQ"
              align="center"
            />
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

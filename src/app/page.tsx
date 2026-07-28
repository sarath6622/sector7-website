import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { FacilitiesPreview } from "@/components/home/FacilitiesPreview";
import { TransformationPreview } from "@/components/home/TransformationPreview";
import { TrainersPreview } from "@/components/home/TrainersPreview";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { LocationPreview } from "@/components/home/LocationPreview";
import { CTABanner } from "@/components/home/CTABanner";
import { FAQ } from "@/components/home/FAQ";
import type { FAQItem } from "@/components/home/FAQAccordion";
import { sanityClient, urlFor, isSanityConfigured } from "@/lib/sanity/client";
import { ALL_TRAINERS_QUERY, FEATURED_TRANSFORMATIONS_QUERY, FACILITIES_PREVIEW_QUERY, HERO_IMAGE_QUERY, HOME_FAQS_QUERY } from "@/lib/sanity/queries";
import type { TrainerPreviewItem } from "@/components/home/TrainersPreview";
import type { TransformationPreviewItem } from "@/components/home/TransformationPreview";
import { generateMetadata as buildMetadata, generateJSONLD } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector7.in";

export const metadata: Metadata = buildMetadata({
  title: "Sector 7 | Premier Gym in Kochi",
  description:
    "Sector 7 is Kochi's premier gym — elite equipment, certified trainers, and thousands of proven transformations. Get in touch to start training today.",
  path: "/",
  keywords: [
    "gym in Kochi", "best gym Kochi", "gym near me Kochi",
    "fitness center Kochi", "gym Kakkanad", "CrossFit Kochi",
    "personal trainer Kochi", "weight loss gym Kochi",
    "strength training Kochi", "gym membership Kochi",
    "SEC7OR Fitness", "Sector 7 gym", "gym Kerala",
  ],
});

export const revalidate = 3600;

// ── Static FAQ fallback (used when Sanity has no FAQs) ────────────────────────
const STATIC_FAQS: FAQItem[] = [
  {
    question: "Where is Sector 7 located?",
    answer:
      "Sector 7 (SEC7OR Fitness) is in Kakkanad, Kochi — near the Infopark Expressway, Chittethukara. Free on-site parking is available.",
  },
  {
    question: "What are your gym timings?",
    answer:
      "We're open every day from 5:00 AM to 11:00 PM, so you can train early before work or late in the evening.",
  },
  {
    question: "Can I visit the gym before joining?",
    answer:
      "Absolutely. Drop by during opening hours or get in touch to arrange a walkthrough — our team will show you every training zone and answer your questions.",
  },
  {
    question: "Do you offer personal training?",
    answer:
      "Yes. We have certified personal trainers for one-on-one coaching, plus structured group and CrossFit classes for every fitness level.",
  },
  {
    question: "Do you have a CrossFit box?",
    answer:
      "Yes. Sector 7 has a dedicated CrossFit box with certified coaches, alongside strength, cardio, and functional training zones.",
  },
  {
    question: "How do I sign up for a membership?",
    answer:
      "Contact us or visit the gym, and our team will walk you through the current membership options and help you get started.",
  },
];

/**
 * Homepage — /
 * Server Component: fetches Sanity data for preview sections and passes as props.
 */
export default async function HomePage() {
  // ── Hero image ──────────────────────────────────────────────────────────────
  let heroImageUrl: string | null = null;
  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<{ heroImage?: { asset?: { _ref: string } } }>(
        HERO_IMAGE_QUERY
      );
      if (data?.heroImage?.asset) {
        heroImageUrl = urlFor(data.heroImage).width(1200).height(1120).url();
      }
    } catch { /* fall through */ }
  }

  // ── Facility preview images ─────────────────────────────────────────────────
  let facilityImages: (string | null)[] = [];
  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<{ image?: { asset?: { _ref: string } } }[]>(
        FACILITIES_PREVIEW_QUERY
      );
      if (data?.length) {
        facilityImages = data.map((f) =>
          f.image?.asset ? urlFor(f.image).width(800).height(600).url() : null
        );
      }
    } catch { /* fall through */ }
  }

  // ── Trainers ────────────────────────────────────────────────────────────────
  let trainers: TrainerPreviewItem[] = [];
  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<TrainerPreviewItem[]>(ALL_TRAINERS_QUERY);
      if (data?.length) trainers = data.slice(0, 4);
    } catch { /* fall through */ }
  }

  // ── Transformations ─────────────────────────────────────────────────────────
  interface SanityTransformation {
    _id: string;
    clientName: string;
    goal: string;
    durationMonths: number;
    weightChange?: number;
    changeLabel?: string;
    afterImage?: { asset?: { _ref: string } };
  }

  let transformationItems: TransformationPreviewItem[] = [];
  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<SanityTransformation[]>(FEATURED_TRANSFORMATIONS_QUERY);
      if (data?.length) {
        transformationItems = data.map((t) => ({
          _id: t._id,
          clientName: t.clientName,
          goal: t.goal,
          durationMonths: t.durationMonths,
          weightChange: t.weightChange,
          changeLabel: t.changeLabel,
          afterImageUrl: t.afterImage?.asset
            ? urlFor(t.afterImage).width(320).height(427).url()
            : undefined,
        }));
      }
    } catch { /* fall through */ }
  }

  // ── FAQs ────────────────────────────────────────────────────────────────────
  let faqs: FAQItem[] = STATIC_FAQS;
  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<{ faqs?: FAQItem[] } | null>(HOME_FAQS_QUERY);
      if (data?.faqs?.length) faqs = data.faqs;
    } catch { /* fall through to static */ }
  }

  const websiteLD = generateJSONLD("WebSite", {
    name: "Sector 7",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });

  const faqLD = generateJSONLD("FAQPage", {
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteLD }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqLD }}
      />
      <Hero heroImageUrl={heroImageUrl} />
      <Highlights />
      <FacilitiesPreview facilityImages={facilityImages} />
      <TransformationPreview items={transformationItems} />
      <TrainersPreview trainers={trainers} />
      <GoogleReviews />
      <LocationPreview />
      <FAQ items={faqs} />
      <CTABanner />
    </>
  );
}

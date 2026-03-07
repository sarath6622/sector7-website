import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { FacilitiesPreview } from "@/components/home/FacilitiesPreview";
import { TransformationPreview } from "@/components/home/TransformationPreview";
import { TrainersPreview } from "@/components/home/TrainersPreview";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { LocationPreview } from "@/components/home/LocationPreview";
import { CTABanner } from "@/components/home/CTABanner";
import { sanityClient, urlFor, isSanityConfigured } from "@/lib/sanity/client";
import { ALL_TRAINERS_QUERY, FEATURED_TRANSFORMATIONS_QUERY } from "@/lib/sanity/queries";
import type { TrainerPreviewItem } from "@/components/home/TrainersPreview";
import type { TransformationPreviewItem } from "@/components/home/TransformationPreview";

export const revalidate = 3600;

/**
 * Homepage — /
 * Server Component: fetches Sanity data for preview sections and passes as props.
 */
export default async function HomePage() {
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

  return (
    <>
      <Hero />
      <Highlights />
      <FacilitiesPreview />
      <TransformationPreview items={transformationItems} />
      <TrainersPreview trainers={trainers} />
      <GoogleReviews />
      <LocationPreview />
      <CTABanner />
    </>
  );
}

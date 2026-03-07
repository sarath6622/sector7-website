import { Hero }                 from "@/components/home/Hero";
import { Highlights }            from "@/components/home/Highlights";
import { FacilitiesPreview }     from "@/components/home/FacilitiesPreview";
import { TransformationPreview } from "@/components/home/TransformationPreview";
import { TrainersPreview }       from "@/components/home/TrainersPreview";
import { GoogleReviews }         from "@/components/home/GoogleReviews";
import { LocationPreview }       from "@/components/home/LocationPreview";
import { CTABanner }             from "@/components/home/CTABanner";

/**
 * Homepage — /
 * Phase 6: full homepage assembled from section components.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />
      <FacilitiesPreview />
      <TransformationPreview />
      <TrainersPreview />
      <GoogleReviews />
      <LocationPreview />
      <CTABanner />
    </>
  );
}

import { PageHeroSkeleton, CardGridSkeleton, PageLoadingShell } from "@/components/ui/Skeleton";

export default function TransformationsLoading() {
  return (
    <PageLoadingShell>
      <PageHeroSkeleton />
      <div className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section">
          <CardGridSkeleton count={6} imageHeight="h-80" />
        </div>
      </div>
    </PageLoadingShell>
  );
}

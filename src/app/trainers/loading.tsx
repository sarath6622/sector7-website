import { PageHeroSkeleton, CardGridSkeleton, PageLoadingShell } from "@/components/ui/Skeleton";

export default function TrainersLoading() {
  return (
    <PageLoadingShell>
      <PageHeroSkeleton />
      <div className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section">
          <CardGridSkeleton count={6} imageHeight="h-72" />
        </div>
      </div>
    </PageLoadingShell>
  );
}

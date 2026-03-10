import { Skeleton, PageHeroSkeleton, PageLoadingShell } from "@/components/ui/Skeleton";

export default function PricingLoading() {
  return (
    <PageLoadingShell>
      <PageHeroSkeleton />
      <div className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section">
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 p-6 bg-surface rounded">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-full" />
                <div className="flex flex-col gap-2 mt-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <Skeleton key={j} className="h-3 w-full" />
                  ))}
                </div>
                <Skeleton className="h-12 w-full mt-auto" />
              </div>
            ))}
          </div>

          {/* FAQ section */}
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}

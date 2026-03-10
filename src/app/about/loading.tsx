import { Skeleton, PageHeroSkeleton, PageLoadingShell } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <PageLoadingShell>
      <PageHeroSkeleton />

      {/* Mission section */}
      <div className="py-20 bg-bg-primary container-section max-w-3xl flex flex-col gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Timeline */}
      <div className="py-20 bg-bg-secondary">
        <div className="container-section flex flex-col gap-8">
          <Skeleton className="h-6 w-40 mb-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6 items-start">
              <Skeleton className="h-8 w-16 flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values grid */}
      <div className="py-20 bg-bg-primary container-section">
        <Skeleton className="h-6 w-40 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 bg-surface rounded">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </PageLoadingShell>
  );
}

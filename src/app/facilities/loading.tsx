import { Skeleton, PageHeroSkeleton, PageLoadingShell } from "@/components/ui/Skeleton";

export default function FacilitiesLoading() {
  return (
    <PageLoadingShell>
      <PageHeroSkeleton />
      <div className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section flex flex-col gap-20">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-10 items-center`}>
              <Skeleton className="w-full md:w-1/2 h-72 md:h-96" />
              <div className="flex flex-col gap-4 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-24 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLoadingShell>
  );
}

import { Skeleton, PageLoadingShell } from "@/components/ui/Skeleton";

/** Homepage loading skeleton — hero + section stubs */
export default function HomeLoading() {
  return (
    <PageLoadingShell>
      {/* Hero */}
      <div className="min-h-dvh bg-bg-primary grid grid-cols-1 lg:grid-cols-2 items-center pt-24 pb-24 gap-12 px-4 md:px-8 lg:px-16">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-3 w-52" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-2/3" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-4/5 max-w-md" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Skeleton className="h-14 w-full sm:w-44" />
            <Skeleton className="h-14 w-full sm:w-48" />
          </div>
        </div>
        <Skeleton className="hidden lg:block h-[560px] w-full" />
      </div>

      {/* Highlights strip */}
      <div className="bg-bg-secondary py-16">
        <div className="container-section grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Facilities preview */}
      <div className="py-20 container-section">
        <Skeleton className="h-6 w-48 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 md:h-64 w-full" />
          ))}
        </div>
      </div>
    </PageLoadingShell>
  );
}

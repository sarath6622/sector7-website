import { Skeleton, PageLoadingShell } from "@/components/ui/Skeleton";

export default function TrainerProfileLoading() {
  return (
    <PageLoadingShell>
      {/* Profile hero */}
      <div className="bg-bg-secondary pt-32 pb-16">
        <div className="container-section flex flex-col md:flex-row gap-10 items-start">
          <Skeleton className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-full" />
          <div className="flex flex-col gap-4 flex-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-5 w-40" />
            <div className="flex gap-3 mt-2">
              {[80, 100, 90].map((w, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-4 w-full max-w-lg" />
              <Skeleton className="h-4 w-4/5 max-w-lg" />
              <Skeleton className="h-4 w-5/6 max-w-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Transformations section */}
      <div className="py-16 container-section">
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    </PageLoadingShell>
  );
}

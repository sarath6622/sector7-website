import { Skeleton, PageLoadingShell } from "@/components/ui/Skeleton";

export default function BlogPostLoading() {
  return (
    <PageLoadingShell>
      {/* Post hero */}
      <div className="bg-bg-secondary pt-32 pb-16">
        <div className="container-section max-w-3xl flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-4/5" />
          <div className="flex items-center gap-4 mt-2">
            <Skeleton variant="circle" className="w-9 h-9 flex-shrink-0" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="container-section max-w-3xl py-8">
        <Skeleton className="h-72 md:h-96 w-full" />
      </div>

      {/* Article body */}
      <div className="container-section max-w-3xl pb-24 flex flex-col gap-4">
        {[100, 90, 100, 75, 100, 85, 60].map((w, i) => (
          <div key={i} style={{ width: `${w}%` }}><Skeleton className="h-4 w-full" /></div>
        ))}
        <Skeleton className="h-8 w-56 mt-4" />
        {[100, 80, 100, 70].map((w, i) => (
          <div key={i} style={{ width: `${w}%` }}><Skeleton className="h-4 w-full" /></div>
        ))}
      </div>
    </PageLoadingShell>
  );
}

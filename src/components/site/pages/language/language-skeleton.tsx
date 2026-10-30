// src/components/site/pages/language/language-skeleton.tsx
export function LanguagePageSkeleton() {
  return (
    <div className="flex flex-col gap-12 pb-20 pt-6 animate-pulse">
      {/* Category Nav Skeleton */}
      <div className="flex gap-6 border-b border-border pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-16 bg-muted rounded" />
        ))}
      </div>

      {/* Hero Section Skeleton */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 h-125 bg-muted rounded-2xl" />
        <div className="lg:col-span-4 flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-video w-full bg-muted rounded-xl" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-6 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="flex flex-col gap-8">
        <div className="border-b border-border pb-4">
          <div className="h-8 w-40 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-16/10 w-full bg-muted rounded-xl" />
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-6 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
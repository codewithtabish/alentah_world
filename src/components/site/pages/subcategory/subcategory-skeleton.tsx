// src/components/site/pages/subcategory/subcategory-skeleton.tsx
export function SubcategoryPageSkeleton() {
  return (
    <div className="flex flex-col pb-20 pt-8 animate-pulse">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        
        {/* Header Skeleton */}
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="h-4 w-32 bg-muted rounded mb-4" />
          <div className="h-10 w-64 bg-muted rounded mb-3" />
          <div className="h-4 w-full max-w-xl bg-muted rounded mb-1" />
          <div className="h-4 w-3/4 max-w-md bg-muted rounded" />
        </div>

        {/* Hero Skeleton */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="aspect-video lg:aspect-auto lg:h-100 bg-muted w-full" />
          <div className="p-6 lg:p-10 flex flex-col gap-4">
            <div className="h-6 w-24 bg-muted rounded-full" />
            <div className="h-10 w-full bg-muted rounded" />
            <div className="h-10 w-4/5 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded mt-2" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-16/10 w-full bg-muted rounded-xl" />
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-6 w-full bg-muted rounded" />
              <div className="h-6 w-3/4 bg-muted rounded" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
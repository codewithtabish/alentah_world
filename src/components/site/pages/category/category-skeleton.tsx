// src/components/site/pages/category/category-skeleton.tsx
export function CategoryPageSkeleton() {
  return (
    <div className="flex flex-col pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full h-75 sm:h-100 bg-muted mb-8" />
      
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Nav Skeleton */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-24 bg-muted rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
               <div className="aspect-4/3 bg-muted rounded-xl" />
               <div className="flex flex-col gap-3">
                 <div className="h-4 w-20 bg-muted rounded" />
                 <div className="h-8 w-full bg-muted rounded" />
                 <div className="h-4 w-5/6 bg-muted rounded" />
               </div>
            </div>
          </div>
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 bg-muted/10 border border-border p-6 rounded-2xl h-100" />
        </div>
      </div>
    </div>
  );
}
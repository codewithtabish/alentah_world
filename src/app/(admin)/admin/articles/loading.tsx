// src/app/admin/articles/loading.tsx

export default function ArticlesLoading() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto animate-pulse">
      
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-9 w-64 bg-muted rounded-md" />
          <div className="h-4 w-96 bg-muted rounded-md" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-md" />
      </div>

      {/* STATS CARDS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 h-27.5">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="size-9 bg-muted rounded-full" />
            </div>
            <div className="flex justify-between items-end">
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* TOOLBAR SKELETON */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg w-full md:w-100 h-11" />
        <div className="h-9 w-full md:w-72 bg-muted rounded-md" />
      </div>

      {/* TABLE SKELETON */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="h-14 bg-muted/30 border-b border-border" />
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              {/* Image */}
              <div className="size-12 bg-muted rounded-md shrink-0" />
              
              {/* Title */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 max-w-md bg-muted rounded" />
              </div>

              {/* Language */}
              <div className="h-6 w-10 bg-muted rounded shrink-0" />
              
              {/* Category */}
              <div className="h-4 w-24 bg-muted rounded shrink-0" />
              
              {/* Subcategory */}
              <div className="h-4 w-24 bg-muted rounded shrink-0" />

              {/* Author */}
              <div className="h-4 w-32 bg-muted rounded shrink-0" />

              {/* Status */}
              <div className="h-6 w-20 bg-muted rounded-full shrink-0" />

              {/* Date */}
              <div className="h-4 w-24 bg-muted rounded shrink-0" />
              
              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <div className="size-8 bg-muted rounded-md" />
                <div className="size-8 bg-muted rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
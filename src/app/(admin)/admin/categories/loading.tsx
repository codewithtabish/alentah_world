// src/app/admin/categories/loading.tsx

export default function CategoriesLoading() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto animate-pulse">
      
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-9 w-48 bg-muted rounded-md" />
          <div className="h-4 w-72 bg-muted rounded-md" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-md" />
      </div>

      {/* STATS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 h-27.5">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* FILTERS SKELETON */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="h-10 flex-1 w-full bg-muted rounded-md" />
        <div className="h-10 w-full md:w-32 bg-muted rounded-md" />
        <div className="h-10 w-full md:w-32 bg-muted rounded-md" />
      </div>

      {/* TABLE SKELETON */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="h-14 bg-muted/30 border-b border-border" />
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className="size-10 bg-muted rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-8 w-20 bg-muted rounded-md" />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
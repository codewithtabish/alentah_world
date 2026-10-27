// src/app/admin/articles/new/loading.tsx

export default function NewArticleLoading() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-pulse">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-9 w-64 bg-muted rounded-md" />
        <div className="h-4 w-96 bg-muted rounded-md" />
      </div>

      {/* FORM SKELETON */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 h-32 sm:h-40" />
          <div className="rounded-2xl border border-border bg-card h-100" />
          <div className="rounded-2xl border border-border bg-card p-6 h-48" />
          <div className="rounded-2xl border border-border bg-card h-20" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 h-87.5" />
          <div className="rounded-2xl border border-border bg-card p-6 h-37.5" />
          <div className="rounded-2xl border border-border bg-card p-6 h-37.5" />
        </div>

      </div>
    </div>
  );
}
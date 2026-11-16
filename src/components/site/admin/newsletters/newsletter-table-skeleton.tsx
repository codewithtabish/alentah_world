// src/components/site/pages/admin/newsletters/newsletter-table-skeleton.tsx
export function NewsletterTableSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Toolbar Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full max-w-sm rounded-md bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-full bg-muted" />
          <div className="h-8 w-24 rounded-full bg-muted" />
          <div className="h-8 w-24 rounded-full bg-muted" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="h-12 w-full border-b border-border bg-muted/50" />
        <div className="divide-y divide-border">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="size-8 rounded-full bg-muted" />
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="ms-auto h-6 w-24 rounded-full bg-muted" />
              <div className="ms-auto h-4 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="h-10 border-t border-border bg-muted/20" />
      </div>
    </div>
  );
}
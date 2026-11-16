// src/components/site/pages/saved/saved-articles-skeleton.tsx
export function SavedArticlesSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col"
          >
            <div className="h-48 w-full bg-muted" />
            <div className="p-5 flex flex-col flex-1 gap-3">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="h-8 w-24 rounded bg-muted" />
                <div className="h-8 w-8 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
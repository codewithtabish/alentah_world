// src/app/(marketing)/contact/loading.tsx
// Shown instantly while the Contact page streams in.

function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-[3px] bg-muted ${className}`} />;
}

export default function Loading() {
  return (
    <div
      className="flex flex-col gap-16 pb-16 lg:gap-24"
      aria-busy="true"
      aria-label="Loading contact page"
    >
      {/* Hero */}
      <div className="flex min-h-88 flex-col justify-center gap-5 py-10">
        <Bar className="h-3 w-32" />
        <Bar className="h-12 w-3/5 max-w-lg" />
        <Bar className="h-12 w-2/5 max-w-sm" />
        <Bar className="mt-2 h-4 w-full max-w-md" />
        <Bar className="h-4 w-4/5 max-w-md" />
        <div className="mt-3 flex gap-3">
          <Bar className="h-12 w-44" />
          <Bar className="h-12 w-40" />
        </div>
      </div>

      {/* Help */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-5">
          <Bar className="h-3 w-40" />
          <Bar className="h-9 w-3/4" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Bar className="h-5 w-3/4" />
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3.1fr)_minmax(0,4.35fr)_minmax(0,2.5fr)]">
        <div className="min-h-112 animate-pulse rounded-lg bg-muted" />
        <div className="flex min-h-112 flex-col gap-5 rounded-lg border border-border p-8">
          <Bar className="h-3 w-24" />
          <Bar className="h-8 w-40" />
          <Bar className="h-11 w-full" />
          <Bar className="h-11 w-full" />
          <Bar className="h-28 w-full" />
          <Bar className="h-11 w-40" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="aspect-3/2 w-full animate-pulse rounded-lg bg-muted" />
          <Bar className="h-6 w-3/4" />
          <Bar className="h-3 w-full" />
          <Bar className="h-3 w-5/6" />
        </div>
      </div>

      {/* FAQ */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-3">
          <Bar className="h-3 w-40" />
          <Bar className="h-9 w-2/3" />
        </div>
        <div className="grid gap-x-12 gap-y-0 sm:grid-cols-2 lg:col-span-9">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bar key={i} className="my-3 h-5 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
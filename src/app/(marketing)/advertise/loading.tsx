// src/app/(marketing)/advertise/loading.tsx
// Shown instantly while the Advertise page streams in.

function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-[3px] bg-muted ${className}`} />;
}

export default function Loading() {
  return (
    <div
      className="flex flex-col gap-20 pb-16 lg:gap-28"
      aria-busy="true"
      aria-label="Loading advertise page"
    >
      {/* Hero */}
      <div className="grid grid-cols-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div className="flex flex-col gap-5">
          <Bar className="h-3 w-40" />
          <Bar className="h-12 w-4/5" />
          <Bar className="h-12 w-3/5" />
          <Bar className="mt-2 h-4 w-full max-w-md" />
          <Bar className="h-4 w-5/6 max-w-md" />
          <div className="mt-4 flex gap-3">
            <Bar className="h-12 w-56" />
            <Bar className="h-12 w-48" />
          </div>
        </div>
        <div className="aspect-3/2 w-full animate-pulse rounded-[6px] bg-muted" />
      </div>

      {/* Why advertise */}
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <Bar className="h-3 w-48" />
            <Bar className="h-10 w-4/5" />
            <Bar className="h-10 w-3/5" />
          </div>
          <div className="flex flex-col gap-3 lg:col-span-7">
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-11/12" />
            <Bar className="h-4 w-4/5" />
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Bar className="size-8" />
              <Bar className="h-5 w-3/4" />
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Bar className="h-3 w-44" />
          <Bar className="h-10 w-3/5" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Bar className="h-5 w-3/4" />
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-5/6" />
              <div className="mt-2 aspect-4/3 w-full animate-pulse rounded-[6px] bg-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="h-72 w-full animate-pulse rounded-[6px] bg-muted" />
    </div>
  );
}
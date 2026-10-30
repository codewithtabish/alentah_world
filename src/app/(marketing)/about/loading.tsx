// Self-contained loading UI (no imports needed).
// Borders + pulse only: no horizontal padding, no backgrounds.
const BOX = "animate-pulse border border-border";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading About page" className="flex flex-col">
      {/* Hero */}
      <div className="grid items-center gap-6 pb-10 md:pb-14 lg:grid-cols-2">
        <div className="order-2 flex flex-col gap-5 lg:order-1">
          <div className={`h-3 w-40 ${BOX}`} />
          <div className={`h-12 w-full max-w-md ${BOX}`} />
          <div className={`h-12 w-4/5 max-w-md ${BOX}`} />
          <div className={`h-16 w-full max-w-md ${BOX}`} />
        </div>
        <div className={`order-1 aspect-video w-full lg:order-2 ${BOX}`} />
      </div>

      {/* Story */}
      <div className="grid gap-8 border-t border-border py-10 lg:grid-cols-[1fr_1.1fr_0.8fr]">
        <div className="flex flex-col gap-4">
          <div className={`h-8 w-3/4 ${BOX}`} />
          <div className={`h-20 w-full ${BOX}`} />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-10 w-full ${BOX}`} />
          ))}
        </div>
        <div className={`aspect-square w-full max-w-sm ${BOX}`} />
      </div>

      {/* Leadership */}
      <div className="grid gap-8 border-t border-border py-10 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-5 sm:flex-row">
            <div className={`aspect-4/5 w-full max-w-xs sm:w-44 ${BOX}`} />
            <div className="flex flex-1 flex-col gap-3">
              <div className={`h-7 w-1/2 ${BOX}`} />
              <div className={`h-4 w-2/3 ${BOX}`} />
              <div className={`h-24 w-full ${BOX}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-6 border-t border-border py-10">
        <div className={`h-8 w-56 ${BOX}`} />
        <ul
          aria-hidden
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <li key={i} className="flex flex-col gap-2">
              <div className={`aspect-4/3 w-full ${BOX}`} />
              <div className={`h-3 w-2/3 ${BOX}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
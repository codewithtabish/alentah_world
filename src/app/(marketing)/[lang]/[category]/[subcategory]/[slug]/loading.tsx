// src/app/[lang]/[category]/[subcategory]/[slug]/loading.tsx

export default function ArticleLoading() {
  return (
    <div className="flex flex-col gap-8 pb-20 pt-8 animate-pulse">
      
      {/* BREADCRUMBS SKELETON */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-3 w-2 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-3 w-2 bg-muted rounded" />
        <div className="h-3 w-24 bg-muted rounded" />
      </div>

      {/* HEADER SKELETON */}
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        
        {/* Category Badge */}
        <div className="h-5 w-24 bg-muted rounded-sm" />

        {/* Title */}
        <div className="flex flex-col gap-3">
          <div className="h-10 sm:h-14 w-full bg-muted rounded-md" />
          <div className="h-10 sm:h-14 w-3/4 bg-muted rounded-md" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="h-5 w-full bg-muted rounded" />
          <div className="h-5 w-5/6 bg-muted rounded" />
        </div>

        {/* Author & Metadata Bar */}
        <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4 sm:ml-auto">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* BANNER IMAGE SKELETON */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="w-full aspect-video lg:aspect-21/9 bg-muted rounded-xl" />
      </div>

      {/* CONTENT SKELETON (Paragraphs) */}
      <div className="max-w-3xl mx-auto w-full mt-4 flex flex-col gap-4">
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-5 w-11/12 bg-muted rounded" />
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-5 w-4/5 bg-muted rounded" />
        
        <div className="h-5 w-full bg-muted rounded mt-4" />
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-5 w-2/3 bg-muted rounded" />
      </div>

    </div>
  );
}
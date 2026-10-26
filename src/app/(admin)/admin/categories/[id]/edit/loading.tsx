// src/app/admin/categories/[id]/edit/loading.tsx

export default function EditCategoryLoading() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-pulse">
      
      {/* HEADER SKELETON */}
      <div className="flex flex-col gap-1">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-9 w-56 bg-muted rounded-md" />
        <div className="h-4 w-80 bg-muted rounded-md mt-1" />
      </div>

      {/* FORM SKELETON */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mt-2">
        
        {/* LEFT COLUMN */}
        <div className="flex-1 w-full">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="h-6 w-48 bg-muted rounded mb-6" />
            <div className="space-y-5">
              <div className="h-10 w-full bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded" />
              <div className="h-32 w-full bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-95 shrink-0 space-y-6">
          
          {/* Appearance Card */}
          <div className="rounded-xl border border-border bg-card p-6 h-87.5">
            <div className="h-6 w-40 bg-muted rounded mb-4" />
            <div className="h-40 w-full bg-muted rounded" />
          </div>

          {/* Settings Card */}
          <div className="rounded-xl border border-border bg-card p-6 h-55">
            <div className="h-6 w-40 bg-muted rounded mb-4" />
            <div className="h-10 w-full bg-muted rounded mb-4" />
            <div className="h-10 w-full bg-muted rounded" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <div className="h-10 w-24 bg-muted rounded" />
            <div className="h-10 w-32 bg-muted rounded" />
          </div>
        </div>

      </div>
    </div>
  );
}
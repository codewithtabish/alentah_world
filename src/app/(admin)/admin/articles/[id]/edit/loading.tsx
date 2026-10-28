// src/app/(admin)/admin/articles/[id]/edit/loading.tsx

import * as React from "react";

export default function EditArticleLoading() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-pulse">
      
      {/* PAGE HEADER SKELETON */}
      <div>
        <div className="h-9 w-64 bg-muted rounded-md mb-2" />
        <div className="h-4 w-96 bg-muted rounded-md" />
      </div>

      {/* MAIN GRID SKELETON */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]" dir="ltr">
        
        {/* LEFT COLUMN: WRITE AREA */}
        <div className="min-w-0">
          
          {/* TABS SKELETON */}
          <div className="mb-6 flex items-center border-b border-border pb-0">
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-muted rounded-t-lg" />
              <div className="h-10 w-24 bg-muted/50 rounded-t-lg" />
            </div>
          </div>

          <div className="space-y-6">
            {/* TITLE BLOCK SKELETON */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="h-12 w-3/4 bg-muted rounded-md mb-6" />
              <div className="flex items-center gap-2">
                <div className="h-9 w-40 bg-muted rounded-s-lg" />
                <div className="h-9 flex-1 bg-muted rounded-e-lg" />
              </div>
            </div>

            {/* EDITOR.JS SKELETON */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card p-6">
              <div className="space-y-4">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-11/12 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-4/5 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded mt-8" />
                <div className="h-4 w-10/12 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-32 w-full bg-muted/50 rounded-xl mt-6 border border-dashed border-muted-foreground/20" />
                <div className="h-4 w-full bg-muted rounded mt-6" />
                <div className="h-4 w-9/12 bg-muted rounded" />
              </div>
            </div>

            {/* MEDIA SKELETON */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="h-4 w-24 bg-muted rounded mb-4" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="h-3 w-24 bg-muted rounded mb-2" />
                  <div className="aspect-video w-full rounded-xl bg-muted/50 border-2 border-dashed border-border" />
                </div>
                <div>
                  <div className="h-3 w-24 bg-muted rounded mb-2" />
                  <div className="aspect-video w-full rounded-xl bg-muted/50 border-2 border-dashed border-border" />
                </div>
              </div>
            </div>

            {/* ACTION BAR SKELETON */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-32 bg-muted rounded-full" />
                <div className="h-10 w-40 bg-muted rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR SETTINGS */}
        <aside className="h-fit space-y-6 xl:sticky xl:top-24">
          
          {/* CLASSIFICATION SKELETON */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="h-3 w-32 bg-muted rounded mb-5" />
            <div className="space-y-5">
              <div>
                <div className="h-3 w-16 bg-muted rounded mb-2" />
                <div className="h-9 w-full bg-muted rounded-lg" />
              </div>
              <div>
                <div className="h-3 w-16 bg-muted rounded mb-2" />
                <div className="h-9 w-full bg-muted rounded-lg" />
              </div>
              <div>
                <div className="h-3 w-20 bg-muted rounded mb-2" />
                <div className="h-9 w-full bg-muted rounded-lg" />
              </div>
              <div>
                <div className="h-3 w-24 bg-muted rounded mb-2" />
                <div className="h-9 w-full bg-muted rounded-lg" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="size-4 bg-muted rounded" />
                <div className="h-4 w-40 bg-muted rounded" />
              </div>
            </div>
          </div>

          {/* GUEST AUTHOR SKELETON */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="h-3 w-28 bg-muted rounded mb-5" />
            <div className="space-y-4">
              <div>
                <div className="h-3 w-24 bg-muted rounded mb-2" />
                <div className="h-9 w-full bg-muted rounded-lg" />
              </div>
              <div>
                <div className="h-3 w-24 bg-muted rounded mb-2" />
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-muted rounded-full" />
                  <div className="h-8 w-28 bg-muted rounded-md" />
                </div>
              </div>
            </div>
          </div>

          {/* TABLE OF CONTENTS SKELETON */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-3 w-12 bg-muted rounded" />
              <div className="h-8 w-16 bg-muted rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-8 flex-1 bg-muted rounded" />
                <div className="size-8 bg-muted rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 bg-muted rounded" />
                <div className="size-8 bg-muted rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 bg-muted rounded" />
                <div className="size-8 bg-muted rounded" />
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
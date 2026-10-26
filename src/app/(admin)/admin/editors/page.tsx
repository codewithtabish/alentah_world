// src/app/admin/editors/page.tsx

import * as React from "react";
import { getEditorsAdmin } from "@/actions/editors/get-editors";
import { EditorsClient } from "@/components/site/admin/editors/editors-client";

export const metadata = {
  title: "Editors | Admin",
};

export default function EditorsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <React.Suspense fallback={<EditorsSkeleton />}>
        <EditorsDataFetcher />
      </React.Suspense>
    </div>
  );
}

async function EditorsDataFetcher() {
  const result = await getEditorsAdmin();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-semibold">Failed to load editors</p>
        <p className="text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  return <EditorsClient initialEditors={result.editors} />;
}

function EditorsSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-9 w-64 bg-muted rounded-md" />
          <div className="h-4 w-96 bg-muted rounded-md" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-md" />
      </div>

      {/* FILTERS SKELETON */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card border border-border p-4 rounded-xl h-18">
        <div className="h-10 flex-1 w-full bg-muted rounded-md" />
        <div className="h-10 w-32 bg-muted rounded-md" />
        <div className="h-10 w-32 bg-muted rounded-md" />
      </div>

      {/* GRID SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 flex flex-col items-center h-65">
            <div className="size-20 rounded-full bg-muted mb-4" />
            <div className="h-5 w-32 bg-muted rounded mb-2" />
            <div className="h-4 w-24 bg-muted rounded mb-6" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
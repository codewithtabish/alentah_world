// src/components/site/home/home-wrapper.tsx

import * as React from "react";
import { getHomeBlogs } from "@/actions/articles/get-home-blogs";
import { HomeClient } from "./home-client";

export function HomeWrapper() {
  return (
    <React.Suspense fallback={<HomeSkeleton />}>
      <HomeDataFetcher />
    </React.Suspense>
  );
}

async function HomeDataFetcher() {
  const result = await getHomeBlogs();

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground">Unable to load stories</h2>
        <p className="text-muted-foreground mt-2">{result.error}</p>
      </div>
    );
  }

  return <HomeClient blogs={result.blogs} />;
}

function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-12 w-full animate-pulse">
      {/* Hero Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-150">
        <div className="lg:col-span-8 bg-muted rounded-2xl h-full" />
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-muted rounded-2xl h-1/2" />
          <div className="bg-muted rounded-2xl h-1/2" />
        </div>
      </div>
      
      {/* Latest Stories Skeleton */}
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-16/10 bg-muted rounded-xl" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-6 w-full bg-muted rounded" />
              <div className="h-6 w-2/3 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
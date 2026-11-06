import * as React from "react";
import { getHomeBlogs } from "@/actions/articles/get-home-blogs";
import { HomeClient, articleHref } from "./home-client";

const SITE_URL = "https://www.eneena.com";
const SITE_NAME = "ENEENA";

const PAGE_TITLE = "ENEENA — Independent Journalism, Global Perspectives";

const PAGE_DESCRIPTION =
  "Original journalism on world affairs, politics, technology, AI, science, business and culture. Read ENEENA in English, Urdu, Arabic, German, Hindi and Chinese.";

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
        <h1 className="sr-only">{PAGE_TITLE}</h1>
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Unable to load stories
        </h2>
        <p className="mt-2 text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  const topStories = result.blogs.slice(0, 12);

  // Organization / WebSite / founder live in the root layout and are
  // referenced by @id. The list only contains stories visible on the page.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntity: { "@id": `${SITE_URL}/#latest-stories` },
        inLanguage: ["en", "ur", "ar", "de", "hi", "zh"],
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#latest-stories`,
        name: `Latest stories from ${SITE_NAME}`,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: topStories.length,
        itemListElement: topStories.map((blog, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}${articleHref(blog)}`,
          name: blog.title,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <HomeClient blogs={result.blogs} />
    </>
  );
}

function HomeSkeleton() {
  return (
    <div
      className="flex w-full animate-pulse flex-col gap-12"
      aria-busy="true"
      aria-label="Loading stories"
    >
      <div className="grid h-150 grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="h-full rounded-2xl bg-muted lg:col-span-8" />
        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="h-1/2 rounded-2xl bg-muted" />
          <div className="h-1/2 rounded-2xl bg-muted" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-16/10 rounded-xl bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-6 w-full rounded bg-muted" />
              <div className="h-6 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
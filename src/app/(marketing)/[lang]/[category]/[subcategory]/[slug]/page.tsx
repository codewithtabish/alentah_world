// src/app/[lang]/[category]/[subcategory]/[slug]/page.tsx

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ChevronLeft } from "lucide-react";
import { getArticleBySlug } from "@/actions/articles/get-article-by-slug";
import { ArticlePreviewer } from "@/components/site/admin/articles/article-previewer";

// ============================================================
// SEO METADATA
// ============================================================
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string; category: string; subcategory: string; slug: string }> 
}) {
  const { lang, category, subcategory, slug } = await params;
  const result = await getArticleBySlug(lang, category, subcategory, slug);

  if (!result.success) {
    return { title: "Article Not Found | Alentah World" };
  }

  const { article } = result;
  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.shortDescription || "";

  return {
    title,
    description,
    alternates: {
      canonical: article.seo?.canonicalUrl || `/${lang}/${category}/${subcategory}/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: article.seo?.ogImage ? [article.seo.ogImage] : [article.bannerImage],
      publishedTime: article.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.seo?.ogImage ? [article.seo.ogImage] : [article.bannerImage],
    },
  };
}

// ============================================================
// MAIN PAGE
// ============================================================
export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ lang: string; category: string; subcategory: string; slug: string }> 
}) {
  const { lang, category, subcategory, slug } = await params;
  
  const result = await getArticleBySlug(lang, category, subcategory, slug);

  if (!result.success) {
    notFound();
  }

  const article = result.article;
  const isRTL = article.language.direction === "RTL";
  
  // Format date based on language
  const publishedDate = article.publishedAt 
    ? new Intl.DateTimeFormat(lang === "ur" ? "ur-PK" : lang === "ar" ? "ar-SA" : "en-US", { 
        month: "long", day: "numeric", year: "numeric" 
      }).format(new Date(article.publishedAt))
    : "";

  const authorName = article.writtenBy || `${article.author.firstName} ${article.author.lastName}`;
  const authorImage = article.writerImageUrl || article.author.imageUrl;

  return (
    <article className="flex flex-col gap-8 pb-20 pt-8" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}>
        <Link href={`/${lang}`} className="hover:text-primary transition-colors">
          {article.language.name}
        </Link>
        <span>/</span>
        <Link href={`/${lang}/${category}`} className="hover:text-primary transition-colors">
          {article.category.name}
        </Link>
        <span>/</span>
        <Link href={`/${lang}/${category}/${subcategory}`} className="hover:text-primary transition-colors">
          {article.subcategory.name}
        </Link>
      </nav>

      {/* 1. HEADER SECTION */}
      <header className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        
        <div className={`flex items-center gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
          <span className={`bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm ${isRTL ? "font-urdu-text" : ""}`}>
            {article.category.name}
          </span>
        </div>

        <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.15] ${isRTL ? "font-urdu-display leading-[1.4]" : ""}`}>
          {article.title}
        </h1>

        {article.shortDescription && (
          <p className={`text-lg sm:text-xl text-muted-foreground leading-relaxed ${isRTL ? "font-urdu-text leading-[2.2]" : ""}`}>
            {article.shortDescription}
          </p>
        )}

        {/* Author & Metadata Bar */}
        <div className={`flex flex-wrap items-center gap-4 py-4 border-y border-border ${isRTL ? "flex-row-reverse" : ""}`}>
          
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            {authorImage && (
              <div className="relative size-10 rounded-full overflow-hidden border border-border">
                <Image src={authorImage} alt={authorName} fill className="object-cover" />
              </div>
            )}
            <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
              <span className={`text-sm font-bold text-foreground ${isRTL ? "font-urdu-text" : ""}`}>
                {authorName}
              </span>
              <span className="text-xs text-muted-foreground">Contributor</span>
            </div>
          </div>

          <div className={`flex items-center gap-4 text-xs font-medium text-muted-foreground sm:ml-auto ${isRTL ? "sm:mr-auto sm:ml-0" : ""}`}>
            <span className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Calendar className="size-4" /> {publishedDate}
            </span>
            <span className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Clock className="size-4" /> {article.readingTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* 2. BANNER IMAGE */}
      {article.bannerImage && (
        <figure className="w-full max-w-6xl mx-auto">
          <div className="relative w-full aspect-video lg:aspect-21/9 overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={article.bannerImage}
              alt={article.bannerImageAlt || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {article.bannerImageAlt && (
            <figcaption className="mt-3 text-center text-xs text-muted-foreground">
              {article.bannerImageAlt}
            </figcaption>
          )}
        </figure>
      )}

      {/* 3. ARTICLE CONTENT */}
      <div className="max-w-3xl mx-auto w-full mt-4">
        <ArticlePreviewer 
          content={article.content} 
          language={article.language.code as any} 
          tableOfContents={article.tableOfContents || []} 
        />
      </div>

      {/* 4. AUTHOR BIO FOOTER */}
      {article.author.bio && (
        <footer className="max-w-3xl mx-auto w-full mt-12 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start">
          {authorImage && (
            <div className="relative size-16 shrink-0 rounded-full overflow-hidden border-2 border-background shadow-sm">
              <Image src={authorImage} alt={authorName} fill className="object-cover" />
            </div>
          )}
          <div className={`flex flex-col gap-1 ${isRTL ? "font-urdu-text text-right" : ""}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
              About the Author
            </span>
            <h3 className="font-serif text-lg font-bold text-foreground">
              {authorName}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {article.author.bio}
            </p>
          </div>
        </footer>
      )}

    </article>
  );
}
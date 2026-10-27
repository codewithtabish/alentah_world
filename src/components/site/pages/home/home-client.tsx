// src/components/site/home/home-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeBlogItem } from "@/actions/articles/get-home-blogs";

interface HomeClientProps {
  blogs: HomeBlogItem[];
}

export function HomeClient({ blogs }: HomeClientProps) {
  if (!blogs.length) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        No stories published yet. Check back soon.
      </div>
    );
  }

  // 1. Separate the blogs by language for the hero section
  const englishBlogs = blogs.filter((b) => b.language.code === "en");
  const urduBlogs = blogs.filter((b) => b.language.code === "ur");
  const arabicBlogs = blogs.filter((b) => b.language.code === "ar");

  const heroEnglish = englishBlogs[0];
  const sideUrdu = urduBlogs[0];
  const sideArabic = arabicBlogs[0];

  // 2. The rest go into "Latest Stories" (take 9 to make a perfect 3x3 grid)
  const latestBlogs = blogs.slice(3, 12);

  return (
    <div className="flex flex-col gap-16 pb-20 pt-8">
      
      {/* ============================================================ */}
      {/* 1. TOP HERO SECTION (MIXED LANGUAGES)                        */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: English Hero (Overlay Style) */}
        {heroEnglish && (
          <div className="lg:col-span-8 relative group overflow-hidden rounded-2xl border border-border bg-muted aspect-video lg:aspect-auto lg:h-auto lg:min-h-150">
            <Link href={`/${heroEnglish.language.code}/${heroEnglish.category.slug}/${heroEnglish.subcategory.slug}/${heroEnglish.slug}`} className="absolute inset-0 z-20" />
            
            <Image
              src={heroEnglish.bannerImage}
              alt={heroEnglish.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {heroEnglish.language.name}
                </span>
                <span className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  {heroEnglish.category.name}
                </span>
              </div>
              
              <Link href={`/${heroEnglish.language.code}/${heroEnglish.category.slug}/${heroEnglish.subcategory.slug}/${heroEnglish.slug}`}>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight mb-4 hover:underline">
                  {heroEnglish.title}
                </h1>
              </Link>
              
              <p className="text-white/80 text-base sm:text-lg line-clamp-2 max-w-3xl mb-6">
                {heroEnglish.shortDescription}
              </p>

              <div className="flex items-center gap-3 text-white/90 text-sm">
                <div className="relative size-8 rounded-full overflow-hidden border border-white/20">
                  <Image src={heroEnglish.writerImageUrl || heroEnglish.author.imageUrl || "/placeholder-avatar.jpg"} alt="Author" fill className="object-cover" />
                </div>
                <span className="font-medium">
                  By {heroEnglish.writtenBy || `${heroEnglish.author.firstName} ${heroEnglish.author.lastName}`}
                </span>
                <span className="text-white/50">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {heroEnglish.readingTime} min read
                </span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT: Urdu & Arabic Side Stories (Split Image + Text Style) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Urdu Story */}
          {sideUrdu && (
            <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card h-full" dir="rtl" lang="ur">
              
              {/* Image */}
              <Link href={`/${sideUrdu.language.code}/${sideUrdu.category.slug}/${sideUrdu.subcategory.slug}/${sideUrdu.slug}`} className="relative aspect-video w-full overflow-hidden border-b border-border">
                <Image src={sideUrdu.bannerImage} alt={sideUrdu.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 inset-s-3 flex gap-2">
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded font-urdu-text">
                    اردو
                  </span>
                </div>
              </Link>

              {/* Text Content */}
              <div className="flex flex-col p-5">
                <span className="text-[11px] font-bold text-primary mb-2 font-urdu-text">
                  {sideUrdu.category.name}
                </span>
                
                <Link href={`/${sideUrdu.language.code}/${sideUrdu.category.slug}/${sideUrdu.subcategory.slug}/${sideUrdu.slug}`}>
                  <h2 className="text-xl font-serif font-bold text-foreground leading-normal mb-4 hover:text-primary transition-colors line-clamp-3">
                    {sideUrdu.title}
                  </h2>
                </Link>

                {/* Removed mt-auto so it sits right below the title */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-urdu-text">
                  <div className="relative size-6 rounded-full overflow-hidden border border-border">
                    <Image src={sideUrdu.writerImageUrl || sideUrdu.author.imageUrl || "/placeholder-avatar.jpg"} alt="Author" fill className="object-cover" />
                  </div>
                  <span>{sideUrdu.writtenBy || `${sideUrdu.author.firstName} ${sideUrdu.author.lastName}`}</span>
                  <span>•</span>
                  <span>{sideUrdu.readingTime} منٹ</span>
                </div>
              </div>
            </article>
          )}

          {/* Arabic Story */}
          {sideArabic && (
            <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card h-full" dir="rtl" lang="ar">
              
              {/* Image */}
              <Link href={`/${sideArabic.language.code}/${sideArabic.category.slug}/${sideArabic.subcategory.slug}/${sideArabic.slug}`} className="relative aspect-video w-full overflow-hidden border-b border-border">
                <Image src={sideArabic.bannerImage} alt={sideArabic.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 inset-s-3 flex gap-2">
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded font-arabic-text">
                    العربية
                  </span>
                </div>
              </Link>

              {/* Text Content */}
              <div className="flex flex-col p-5">
                <span className="text-[11px] font-bold text-primary mb-2 font-arabic-text">
                  {sideArabic.category.name}
                </span>
                
                <Link href={`/${sideArabic.language.code}/${sideArabic.category.slug}/${sideArabic.subcategory.slug}/${sideArabic.slug}`}>
                  <h2 className="text-xl font-bold text-foreground leading-normal mb-4 hover:text-primary transition-colors line-clamp-3 font-arabic-display">
                    {sideArabic.title}
                  </h2>
                </Link>

                {/* Removed mt-auto so it sits right below the title */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-arabic-text">
                  <div className="relative size-6 rounded-full overflow-hidden border border-border">
                    <Image src={sideArabic.writerImageUrl || sideArabic.author.imageUrl || "/placeholder-avatar.jpg"} alt="Author" fill className="object-cover" />
                  </div>
                  <span>{sideArabic.writtenBy || `${sideArabic.author.firstName} ${sideArabic.author.lastName}`}</span>
                  <span>•</span>
                  <span>{sideArabic.readingTime} دقائق</span>
                </div>
              </div>
            </article>
          )}

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. LATEST STORIES GRID (3x3 MIXED)                         */}
      {/* ============================================================ */}
      <section className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-3xl font-serif font-bold text-foreground">Latest Stories</h2>
          <Link href="/latest" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View All Stories <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {latestBlogs.map((blog) => {
            const isRTL = blog.language.direction === "RTL";
            const fontClass = blog.language.code === "ur" 
              ? "font-urdu-text" 
              : blog.language.code === "ar" 
                ? "font-arabic-text" 
                : "font-body";

            return (
              <article key={blog.id} dir={isRTL ? "rtl" : "ltr"} className="group flex flex-col gap-4">
                
                {/* Image */}
                <Link href={`/${blog.language.code}/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`} className="relative aspect-16/10 overflow-hidden rounded-xl border border-border bg-muted">
                  <Image
                    src={blog.bannerImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 inset-s-3 flex gap-2">
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {blog.language.name}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <span className={cn("text-[11px] font-bold uppercase tracking-wider text-primary mb-2", fontClass)}>
                    {blog.category.name}
                  </span>
                  
                  <Link href={`/${blog.language.code}/${blog.category.slug}/${blog.subcategory.slug}/${blog.slug}`}>
                    <h3 className={cn(
                      "text-xl font-serif font-bold text-foreground leading-snug mb-2 hover:text-primary transition-colors line-clamp-2",
                      isRTL && blog.language.code === "ur" ? "font-urdu-display text-2xl leading-normal" : 
                      isRTL && blog.language.code === "ar" ? "font-arabic-display text-2xl leading-normal" : ""
                    )}>
                      {blog.title}
                    </h3>
                  </Link>
                  
                  <p className={cn("text-sm text-muted-foreground line-clamp-2 mb-4", fontClass)}>
                    {blog.shortDescription}
                  </p>

                  {/* Author Footer */}
                  <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="relative size-6 rounded-full overflow-hidden border border-border">
                      <Image src={blog.writerImageUrl || blog.author.imageUrl || "/placeholder-avatar.jpg"} alt="Author" fill className="object-cover" />
                    </div>
                    <span className={cn("font-medium", fontClass)}>
                      {blog.writtenBy || `${blog.author.firstName} ${blog.author.lastName}`}
                    </span>
                    <span>•</span>
                    <span className={cn("flex items-center gap-1", fontClass)}>
                      <Clock className="size-3" /> {blog.readingTime} min
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
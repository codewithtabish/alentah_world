// src/components/site/pages/category/category-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { ChevronRight, ChevronLeft, MapPin, Globe } from "lucide-react";
import type { CategoryPageBlog, CategoryPageData } from "@/actions/articles/get-category-blogs";

interface CategoryClientProps {
  langCode: string;
  category: CategoryPageData;
  blogs: CategoryPageBlog[];
  totalPages: number;
  currentPage: number;
  totalCount: number; // 👈 Added
}

// Date formatting helper
function formatRelativeTime(date: Date, langCode: string) {
  if (langCode === "ur") return "حال ہی میں"; 
  if (langCode === "ar") return formatDistanceToNow(date, { addSuffix: true, locale: ar });
  return formatDistanceToNow(date, { addSuffix: true });
}

export function CategoryClient({ langCode, category, blogs, totalPages, currentPage, totalCount }: CategoryClientProps) {
  const isRTL = category.language.direction === "RTL";
  const fontClass = isRTL ? "font-urdu-text" : "font-sans";
  const titleFont = isRTL ? "font-urdu-display" : "font-serif";

  const isFirstPage = currentPage === 1;
  const heroBlog = isFirstPage ? blogs[0] : null;
  const gridBlogs = isFirstPage ? blogs.slice(1) : blogs;

  const getHref = (b: CategoryPageBlog) => `/${langCode}/${category.slug}/${b.subcategory.slug}/${b.slug}`;

  return (
    <div className="flex flex-col pb-20 pt-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        
        {/* 1. BREADCRUMBS */}
        <nav className={cn("flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-8", fontClass)}>
          <Link href={`/${langCode}`} className="hover:text-primary transition-colors">
            {isRTL ? "صفحہ اول" : "Home"}
          </Link>
          <ChevronRight className="size-3 rtl:rotate-180" />
          <span className="text-primary">{category.name}</span>
        </nav>

        {/* 2. PAGE HEADER */}
        <header className="text-center mb-12">
          <h1 className={cn("text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4", titleFont, "leading-[1.6]")}>
            {category.name}
          </h1>
          {category.description && (
            <p className={cn("max-w-3xl mx-auto text-sm sm:text-base text-muted-foreground leading-[2.2]", fontClass)}>
              {category.description}
            </p>
          )}
        </header>

        {/* 3. EDITOR CARD */}
        {category.editor && (
          <div className="max-w-2xl mx-auto mb-16 border border-border rounded-2xl p-8 text-center bg-card shadow-sm relative mt-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background border border-border px-4 py-1.5 rounded-full text-xs font-bold text-foreground">
              {category.name}
            </div>

            <div className="relative size-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20 p-1">
               <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src={category.editor.imageUrl || "/placeholder-avatar.jpg"} alt={category.editor.name} fill className="object-cover" />
               </div>
            </div>
            
            <h3 className={cn("text-xl font-bold text-foreground mb-1", titleFont)}>
              {category.editor.name}
            </h3>
            <p className={cn("text-sm text-primary font-medium mb-3", fontClass)}>
              {isRTL ? "ادبی مدیر" : "Literary Editor"}
            </p>
            {category.editor.bio && (
              <p className={cn("text-sm text-muted-foreground leading-loose mb-4", fontClass)}>
                {category.editor.bio}
              </p>
            )}
            
            <div className={cn("flex items-center justify-center gap-4 text-xs text-muted-foreground", fontClass)}>
               {category.editor.location && (
                 <span className="flex items-center gap-1"><MapPin className="size-3" /> {category.editor.location}</span>
               )}
               {category.editor.experience && (
                 <span className="flex items-center gap-1"><Globe className="size-3" /> {category.editor.experience}</span>
               )}
            </div>
          </div>
        )}

        {/* 4. SUBCATEGORY NAVIGATION */}
        {category.subcategories.length > 0 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            <Link
              href={`/${langCode}/${category.slug}`}
              className={cn("whitespace-nowrap rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:scale-105", fontClass)}
            >
              {isRTL ? "تمام" : "All"}
            </Link>
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/${langCode}/${category.slug}/${sub.slug}`}
                className={cn("whitespace-nowrap rounded-full bg-muted/50 border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors", fontClass)}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* 5. HERO ARTICLE */}
        {heroBlog && (
          <section className="mb-16">
            <Link 
              href={getHref(heroBlog)}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center"
            >
              <div className="relative w-full aspect-video lg:aspect-4/3 overflow-hidden rounded-2xl border border-border shadow-sm">
                <Image 
                  src={heroBlog.bannerImage} 
                  alt={heroBlog.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className={cn("text-sm font-bold text-primary mb-3", fontClass)}>
                  {heroBlog.subcategory.name}
                </span>
                
                <h2 className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.7] mb-4 group-hover:text-primary transition-colors", titleFont)}>
                  {heroBlog.title}
                </h2>
                
                {heroBlog.shortDescription && (
                  <p className={cn("text-base text-muted-foreground leading-[2.2] mb-6", fontClass)}>
                    {heroBlog.shortDescription}
                  </p>
                )}

                <div className={cn("mt-auto flex items-center gap-3 text-sm text-muted-foreground", fontClass)}>
                  <div className="relative size-10 rounded-full overflow-hidden border border-border shrink-0">
                    <Image src={heroBlog.writerImageUrl || heroBlog.author.imageUrl || "/placeholder-avatar.jpg"} alt="Author" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{heroBlog.writtenBy || `${heroBlog.author.firstName} ${heroBlog.author.lastName}`}</span>
                    <span className="text-xs">{heroBlog.publishedAt ? formatRelativeTime(new Date(heroBlog.publishedAt), langCode) : ""}</span>
                  </div>
                  <span className="ms-auto text-primary font-bold text-sm hover:underline">
                    {isRTL ? "مکمل مضمون پڑھیں ←" : "Read full story →"}
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 6. LATEST STORIES GRID */}
        <section>
          <div className="flex items-center justify-between border-b border-border pb-3 mb-8">
            <h2 className={cn("text-2xl font-bold text-foreground", titleFont)}>
              {isRTL ? "تازہ ترین مضامین" : "Latest Stories"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {gridBlogs.map((blog) => (
              <article key={blog.id} className="group flex flex-col gap-4">
                <Link href={getHref(blog)} className="relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted">
                  <Image src={blog.bannerImage} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 inset-s-3">
                     <span className={cn("bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-sm", fontClass)}>
                        {blog.subcategory.name}
                     </span>
                  </div>
                </Link>
                <div className="flex flex-col flex-1">
                  <Link href={getHref(blog)}>
                    <h3 className={cn("text-xl font-bold text-foreground hover:text-primary transition-colors leading-[1.8] line-clamp-2 mb-2", titleFont)}>
                      {blog.title}
                    </h3>
                  </Link>
                  {blog.shortDescription && (
                    <p className={cn("text-sm text-muted-foreground line-clamp-2 leading-loose", fontClass)}>
                      {blog.shortDescription}
                    </p>
                  )}
                  
                  <div className={cn("mt-auto pt-4 flex items-center gap-2 text-xs text-muted-foreground", fontClass)}>
                    <div className="relative size-6 rounded-full overflow-hidden border border-border">
                      <Image src={blog.writerImageUrl || blog.author.imageUrl || "/placeholder-avatar.jpg"} alt="Author" fill className="object-cover" />
                    </div>
                    <span className="font-semibold text-foreground">{blog.writtenBy || `${blog.author.firstName} ${blog.author.lastName}`}</span>
                    <span>•</span>
                    <span>{blog.publishedAt ? formatRelativeTime(new Date(blog.publishedAt), langCode) : ""}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 7. PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-16">
            {currentPage > 1 && (
              <Link
                href={`/${langCode}/${category.slug}?page=${currentPage - 1}`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold hover:bg-muted transition-colors"
              >
                <ChevronLeft className="size-4 rtl:rotate-180 me-1" /> {isRTL ? "پچھلا" : "Prev"}
              </Link>
            )}
            
            <span className={cn("text-sm font-bold text-muted-foreground", fontClass)}>
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/${langCode}/${category.slug}?page=${currentPage + 1}`}
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold hover:bg-muted transition-colors"
              >
                {isRTL ? "اگلا" : "Next"} <ChevronRight className="size-4 rtl:rotate-180 ms-1" />
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
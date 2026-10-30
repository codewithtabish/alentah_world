// src/components/site/shared/breadcrumbs.tsx
import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit for the current (last) page
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  isRTL?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, isRTL = false, className }: BreadcrumbsProps) {
  const fontClass = isRTL ? "font-urdu-text" : "font-sans";
  // Tall line-height so Urdu ascenders/descenders are never clipped
  const lh = isRTL ? "leading-[2.2]" : "leading-normal";

  return (
    <nav aria-label="Breadcrumb" dir={isRTL ? "rtl" : "ltr"} className={cn("w-full", className)}>
      <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 py-1 text-sm", lh, fontClass)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
              {isLast || !item.href ? (
                <span
                  aria-current="page"
                  className="wrap-break-word font-semibold text-foreground"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  {isFirst && <Home className="size-3.5 shrink-0" aria-hidden />}
                  <span>{item.label}</span>
                </Link>
              )}

              {!isLast && (
                <ChevronRight
                  aria-hidden
                  className="size-3.5 shrink-0 text-muted-foreground/60 rtl:rotate-180"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
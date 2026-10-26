"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronDown, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function AdminHeader() {
  const pathname = usePathname();
  const { user } = useUser();

  // ============================================
  // BREADCRUMB LOGIC (Filter out IDs)
  // ============================================
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Filter out any segment that looks like a database ID (e.g., cuid, uuid)
  // This prevents the breadcrumb from linking to a 404 page.
  const breadcrumbSegments = pathSegments.filter((segment, index) => {
    // If it's the last segment and it says "edit", keep it.
    if (segment === "edit") return true;
    // If it's a long string (> 20 chars) or starts with 'c' (CUID), filter it out
    if (segment.length > 20 || (segment.startsWith("c") && segment.length > 15)) {
      return false; 
    }
    return true;
  });

  const breadcrumbs = breadcrumbSegments.map((segment, index) => {
    // Reconstruct the href based on the original pathSegments to keep links accurate
    // But since we filtered, we just want to link to the parent category list.
    
    // If we are at "edit", link back to the parent (e.g., /admin/categories)
    if (segment === "edit") {
      return { 
        href: "/admin/categories", 
        label: "Edit" 
      };
    }

    // For standard segments like "admin", "categories"
    const originalIndex = pathSegments.indexOf(segment);
    const href = `/${pathSegments.slice(0, originalIndex + 1).join("/")}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    
    return { href, label };
  });

  return (
    <header className="flex h-18 w-full items-center justify-between border-b border-border bg-background px-6">
      
      {/* LEFT: BREADCRUMBS */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap overflow-hidden">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.href + index}>
              {index > 0 && <span className="text-border">/</span>}
              {isLast ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* SEARCH BAR */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles, categories, editors..."
            className="h-9 w-70 rounded-md border border-border bg-background pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span> K
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <button className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            3
          </span>
        </button>

        {/* PROFILE AVATAR */}
        <button className="flex items-center gap-2 rounded-full border border-transparent p-0.5 transition-colors hover:border-border">
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt={user.fullName ?? "Admin"}
              className="size-8 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user?.firstName?.[0]?.toUpperCase() ?? "A"}
            </div>
          )}
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>

        {/* NEW ARTICLE BUTTON */}
        <Link
          href="/admin/articles/new"
          className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          <span>New Article</span>
        </Link>

      </div>
    </header>
  );
}
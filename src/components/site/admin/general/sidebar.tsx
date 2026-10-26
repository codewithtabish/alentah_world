"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderTree,
  Layers,
  Users,
  Globe,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";

const NAV_ITEMS = [
  {
    group: "Content Management",
    items: [
      { name: "Articles", href: "/admin/articles", icon: FileText },
      { name: "Categories", href: "/admin/categories", icon: FolderTree },
      { name: "Subcategories", href: "/admin/subcategories", icon: Layers },
    ],
  },
  {
    group: "Publication Team",
    items: [
      { name: "Editors", href: "/admin/editors", icon: Users },
      { name: "Languages", href: "/admin/languages", icon: Globe },
      { name: "Newsletters", href: "/admin/newsletters", icon: Mail },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isSettingsActive =
    pathname === "/admin/settings" || pathname.startsWith("/admin/settings/");

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-e border-border bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-65"
      )}
    >
      {/* HEADER / LOGO */}
      <div className="flex h-18 shrink-0 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          
          {/* Custom Logo Mark (Stacked Pages) */}
          <div className="flex size-9 shrink-0 items-center justify-center text-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-8"
            >
              {/* Left page */}
              <path d="M5 4v16l4-2V6L5 4z" fill="currentColor" opacity="0.8" />
              {/* Middle page */}
              <path d="M9 6v12l4-2V8L9 6z" fill="currentColor" opacity="0.9" />
              {/* Right page (slightly separated) */}
              <path d="M14 8v8l4-2V10l-4-2z" fill="currentColor" />
            </svg>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col leading-none whitespace-nowrap">
              <span className="font-serif text-[17px] font-bold tracking-tight text-foreground">
                THE INSIDER
              </span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Editorial Studio
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-21 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <ChevronLeft className="size-3.5" />
        )}
      </button>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
        <ul className="space-y-8 px-3">
          {NAV_ITEMS.map((group, groupIdx) => (
            <li key={groupIdx}>
              {/* Group Title */}
              {!isCollapsed && (
                <h3 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap">
                  {group.group}
                </h3>
              )}
              {isCollapsed && groupIdx > 0 && (
                <div className="mx-auto mb-4 h-px w-8 bg-border" />
              )}

              {/* Group Items */}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          isCollapsed && "justify-center px-0"
                        )}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <item.icon
                          className={cn(
                            "size-5 shrink-0",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                          strokeWidth={isActive ? 2 : 1.75}
                        />
                        {!isCollapsed && (
                          <span
                            className={cn(
                              "text-sm whitespace-nowrap",
                              isActive ? "font-medium" : "font-normal"
                            )}
                          >
                            {item.name}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* BOTTOM SECTION (Settings + User Profile) */}
      <div className="mt-auto border-t border-border p-3 space-y-2">
        
        {/* Settings Link */}
        <Link
          href="/admin/settings"
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
            isSettingsActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            isCollapsed && "justify-center px-0"
          )}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings
            className={cn(
              "size-5 shrink-0",
              isSettingsActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}
            strokeWidth={isSettingsActive ? 2 : 1.75}
          />
          {!isCollapsed && (
            <span
              className={cn(
                "text-sm whitespace-nowrap",
                isSettingsActive ? "font-medium" : "font-normal"
              )}
            >
              Settings
            </span>
          )}
        </Link>

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt={user.fullName ?? "Admin"}
                className="size-8 shrink-0 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {user?.firstName?.[0]?.toUpperCase() ?? "A"}
              </div>
            )}

            {!isCollapsed && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="truncate text-sm font-medium text-foreground">
                  {user?.fullName ?? "Administrator"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Admin
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
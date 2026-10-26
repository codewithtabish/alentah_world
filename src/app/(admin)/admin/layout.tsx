// src/app/admin/layout.tsx

import * as React from "react";
import { AdminHeader } from "@/components/site/admin/general/admin-header";
import { AdminSidebar } from "@/components/site/admin/general/sidebar";
import type { Metadata } from "next";

// ============================================================
// ADMIN METADATA
// ============================================================
//
// Admin pages must NEVER be indexed by Google or any other
// crawler.

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

// ============================================================
// LAYOUT
// ============================================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      
      {/* SIDEBAR (Fixed height on the left) */}
      <div className="hidden lg:block shrink-0">
        {/* Wrap Sidebar in Suspense to fix usePathname blocking error */}
        <React.Suspense fallback={<div className="h-screen w-65 border-e border-border bg-background" />}>
          <AdminSidebar />
        </React.Suspense>
      </div>

      {/* RIGHT SIDE (Header + Content) */}
      <div className="flex flex-1 flex-col min-w-0">
        
        {/* HEADER (Sticky at the top of the right side) */}
        <div className="sticky top-0 z-30">
          {/* Wrap Header in Suspense as it might also use dynamic hooks */}
          <React.Suspense fallback={<div className="h-18 w-full border-b border-border bg-background" />}>
            <AdminHeader />
          </React.Suspense>
        </div>

        {/* MAIN CONTENT (Scrollable area) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
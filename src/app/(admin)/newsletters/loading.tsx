// src/app/[lang]/admin/newsletters/loading.tsx
import { NewsletterTableSkeleton } from "@/components/site/admin/newsletters/newsletter-table-skeleton";
import { Users, CheckCircle2, Mail } from "lucide-react";

export default function AdminNewslettersLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div>
        <div className="h-10 w-64 rounded bg-muted animate-pulse mb-3" />
        <div className="h-5 w-96 rounded bg-muted animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[Users, CheckCircle2, Mail].map((Icon, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Icon className="size-6 text-muted-foreground/30" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-6 w-16 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <NewsletterTableSkeleton />
      </div>
    </div>
  );
}
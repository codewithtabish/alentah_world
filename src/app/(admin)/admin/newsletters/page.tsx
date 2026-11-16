// src/app/[lang]/admin/newsletters/page.tsx
import { Suspense } from "react";
import { getNewsletterSubscribers } from "@/actions/newsletter/get-newsletter-subscribers";
import { Mail, Users, CheckCircle2 } from "lucide-react";
import { NewsletterTable } from "@/components/site/admin/newsletters/newsletter-table";
import { NewsletterTableSkeleton } from "@/components/site/admin/newsletters/newsletter-table-skeleton";

// The Server Component that fetches the actual data
async function SubscribersData() {
  const result = await getNewsletterSubscribers({ limit: 50 });

  if (!result.success) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
        {result.error || "Failed to load subscribers. Please try again later."}
      </div>
    );
  }

  // 👇 FIXED: TypeScript now perfectly understands these exist on success
  return (
    <NewsletterTable 
      initialSubscribers={result.subscribers || []} 
      totalCount={result.totalCount || 0} 
    />
  );
}

export default function AdminNewslettersPage() {
  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Newsletter Subscribers
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your audience for The ENEENA Briefing.
        </p>
      </div>

      {/* STATS CARDS (Static for now, can be dynamic if needed) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
              <h3 className="text-2xl font-bold text-foreground">All</h3>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <h3 className="text-2xl font-bold text-foreground">Subscribed</h3>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-500">
              <Mail className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recent</p>
              <h3 className="text-2xl font-bold text-foreground">Joined</h3>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT (SUSPENSE STREAMED) */}
      <div className="mt-4">
        <Suspense fallback={<NewsletterTableSkeleton />}>
          <SubscribersData />
        </Suspense>
      </div>
    </div>
  );
}
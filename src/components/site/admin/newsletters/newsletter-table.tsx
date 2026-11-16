// src/components/site/pages/admin/newsletters/newsletter-table.tsx
"use client";

import * as React from "react";
import { Search, Mail, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type SubscriberStatus = "PENDING" | "SUBSCRIBED" | "UNSUBSCRIBED";

export interface SubscriberItem {
  id: string;
  email: string;
  status: SubscriberStatus;
  subscribedAt: Date | null;
  createdAt: Date;
}

interface NewsletterTableProps {
  initialSubscribers: SubscriberItem[];
  totalCount: number;
}

export function NewsletterTable({ initialSubscribers, totalCount }: NewsletterTableProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | SubscriberStatus>("ALL");

  // Filter logic
  const filteredSubscribers = React.useMemo(() => {
    return initialSubscribers.filter((sub) => {
      const matchesSearch = sub.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialSubscribers, search, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 ps-9 pe-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {(["ALL", "SUBSCRIBED", "UNSUBSCRIBED", "PENDING"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors border",
                statusFilter === status
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              )}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Email Address</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Mail className="size-4" />
                        </div>
                        {sub.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {sub.subscribedAt 
                        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(sub.subscribedAt))
                        : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(sub.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer / Pagination Info */}
        <div className="border-t border-border bg-muted/20 px-6 py-3 text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredSubscribers.length}</span> of <span className="font-semibold text-foreground">{totalCount}</span> total subscribers
        </div>
      </div>
    </div>
  );
}

// Helper component for the status badge
function StatusBadge({ status }: { status: SubscriberStatus }) {
  switch (status) {
    case "SUBSCRIBED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-3.5" /> Subscribed
        </span>
      );
    case "UNSUBSCRIBED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          <XCircle className="size-3.5" /> Unsubscribed
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <Clock className="size-3.5" /> Pending
        </span>
      );
  }
}
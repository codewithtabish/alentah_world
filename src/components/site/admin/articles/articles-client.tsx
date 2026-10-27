// src/app/admin/articles/articles-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MoreHorizontal, 
  FileText, 
  CheckCircle2, 
  Clock, 
  CalendarClock,
  Edit,
  Trash2,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleListItem, ArticleStats } from "@/actions/articles/get-articles";
import { DeleteArticleDialog } from "./delete-article-dialog";

interface ArticlesClientProps {
  initialArticles: ArticleListItem[];
  stats: ArticleStats;
}

export function ArticlesClient({ initialArticles, stats }: ArticlesClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [articleToDelete, setArticleToDelete] = React.useState<ArticleListItem | null>(null);

  const filteredArticles = initialArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || article.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Editorial Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your publication at a glance.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <FileText className="size-4" />
          New Article
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Articles" 
          value={stats.total} 
          icon={<FileText className="size-5 text-muted-foreground" />} 
        />
        <StatCard 
          title="Published" 
          value={stats.published} 
          icon={<CheckCircle2 className="size-5 text-green-600 dark:text-green-500" />} 
          trend="+18%"
        />
        <StatCard 
          title="Drafts" 
          value={stats.drafts} 
          icon={<Clock className="size-5 text-orange-500" />} 
          trend="+7%"
        />
        <StatCard 
          title="Scheduled" 
          value={stats.scheduled} 
          icon={<CalendarClock className="size-5 text-blue-500" />} 
          trend="+25%"
        />
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          {["all", "published", "draft", "scheduled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors",
                statusFilter === tab 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "all" ? "All Articles" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold w-full max-w-md">Title</th>
                <th className="px-6 py-4 font-semibold">Language</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Subcategory</th>
                <th className="px-6 py-4 font-semibold">Author</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last updated</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No articles found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4 whitespace-normal max-w-md">
                      <div className="flex items-center gap-4">
                        {article.bannerImage ? (
                          <div className="relative size-12 shrink-0 rounded-md overflow-hidden border border-border">
                            <Image src={article.bannerImage} alt={article.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="size-12 shrink-0 rounded-md bg-muted flex items-center justify-center border border-border">
                            <FileText className="size-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link 
                            href={`/admin/articles/${article.id}/edit`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                          >
                            {article.title}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border">
                        {article.language.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {article.category.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {article.subcategory.name}
                    </td>
                    <td className="px-6 py-4">
                      {article.writtenBy ? (
                        <span className="text-sm text-foreground">{article.writtenBy}</span>
                      ) : (
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-foreground">
                             {article.author.firstName} {article.author.lastName}
                           </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                        article.status === "PUBLISHED" && "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50",
                        article.status === "DRAFT" && "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50",
                        article.status === "SCHEDULED" && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50",
                        article.status === "ARCHIVED" && "bg-muted text-muted-foreground border-border"
                      )}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(article.updatedAt))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                          title="Edit Article"
                        >
                          <Edit className="size-4" />
                        </Link>
                        <button
                          onClick={() => setArticleToDelete(article)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
                          title="Delete Article"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE DIALOG */}
      <DeleteArticleDialog 
        article={articleToDelete} 
        onClose={() => setArticleToDelete(null)} 
      />
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  trend?: string 
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-muted/50 rounded-full">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-serif font-bold text-foreground">{value}</p>
        {trend && (
          <span className="text-xs font-medium text-green-600 dark:text-green-500 flex items-center gap-1">
            ↑ {trend} <span className="text-muted-foreground font-normal">vs. previous 30 days</span>
          </span>
        )}
      </div>
    </div>
  );
}
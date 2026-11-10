"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Globe,
  Layers 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryListItem } from "@/actions/categories/get-categories";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { CreateCategorySlideOver } from "./create-category-slide-over";

interface CategoriesClientProps {
  initialCategories: CategoryListItem[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const router = useRouter();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [languageFilter, setLanguageFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  
  // Slide-over & Dialog State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<CategoryListItem | null>(null);

  // Derived Data
  const filteredCategories = initialCategories.filter((cat) => {
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter === "all" || cat.language.code === languageFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? cat.isActive : !cat.isActive);
    
    return matchesSearch && matchesLanguage && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize your publication by language and editorial topic.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Create Category
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Categories" value={initialCategories.length} />
        <StatCard title="Active" value={initialCategories.filter(c => c.isActive).length} />
        <StatCard title="Inactive" value={initialCategories.filter(c => !c.isActive).length} />
        <StatCard title="Languages Covered" value={new Set(initialCategories.map(c => c.language.code)).size} />
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
        
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-border bg-background text-sm outline-none w-full md:w-auto"
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="ur">Urdu</option>
          <option value="ar">Arabic</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-border bg-background text-sm outline-none w-full md:w-auto"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Language</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Subcategories</th>
                <th className="px-6 py-4 font-semibold">Assigned Editor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No categories found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 whitespace-normal">
                      <div className="flex items-center gap-4">
                        {category.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={category.coverImage} alt="" className="size-10 rounded-md object-cover border border-border shrink-0" />
                        ) : (
                          <div className="size-10 rounded-md bg-muted flex items-center justify-center border border-border shrink-0">
                            <Globe className="size-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{category.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 max-w-62.5">
                            {category.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border">
                          {category.language.code}
                        </span>
                        <span className="text-xs text-muted-foreground">{category.language.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {category._count.subcategories} subcategories
                    </td>
                    <td className="px-6 py-4">
                      {category.editor ? (
                        <div className="flex items-center gap-2">
                          {category.editor.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={category.editor.imageUrl} alt="" className="size-6 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                              {category.editor.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm text-foreground">{category.editor.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                        category.isActive 
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50" 
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50"
                      )}>
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {category.sortOrder}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* NEW SUBCATEGORY BUTTON */}
                        <button
                          onClick={() => router.push(`/admin/categories/${category.id}/subcategories`)}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                          title="Manage Subcategories"
                        >
                          <Layers className="size-4" />
                        </button>

                        <button
                          onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                          title="Edit Category"
                        >
                          <Edit className="size-4" />
                        </button>
                        
                        <button
                          onClick={() => setCategoryToDelete(category)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
                          title="Delete Category"
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

      {/* SLIDE-OVER & DIALOGS */}
      <CreateCategorySlideOver 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />
      
      <DeleteCategoryDialog 
        category={categoryToDelete} 
        onClose={() => setCategoryToDelete(null)} 
      />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-3xl font-serif font-bold text-foreground mt-2">{value}</p>
    </div>
  );
}
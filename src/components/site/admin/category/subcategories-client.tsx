// src/app/admin/categories/[id]/subcategories/subcategories-client.tsx
"use client";

import * as React from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { CategoryListItem } from "@/actions/categories/get-categories";
import { cn } from "@/lib/utils";
import { CreateSubcategorySlideOver } from "./create-subcategory-slide-over";
import { DeleteSubcategoryDialog } from "./delete-subcategory-dialog";

interface SubcategoriesClientProps {
  categoryId: string;
  categoryName: string;
  initialSubcategories: CategoryListItem["subcategories"];
}

export function SubcategoriesClient({ categoryId, categoryName, initialSubcategories }: SubcategoriesClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = React.useState<CategoryListItem["subcategories"][0] | null>(null);

  const filteredSubcategories = initialSubcategories.filter((sub) => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search subcategories in ${categoryName}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Create Subcategory
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Subcategory Name</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubcategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No subcategories found.
                  </td>
                </tr>
              ) : (
                filteredSubcategories.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{sub.name}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {sub.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                        sub.isActive 
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50" 
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50"
                      )}>
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSubcategoryToDelete(sub)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
                          title="Delete Subcategory"
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
      <CreateSubcategorySlideOver 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        categoryId={categoryId} 
      />
      
      <DeleteSubcategoryDialog 
        subcategory={subcategoryToDelete} 
        onClose={() => setSubcategoryToDelete(null)} 
      />
    </div>
  );
}
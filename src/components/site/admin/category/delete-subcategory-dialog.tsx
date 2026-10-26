// src/app/admin/categories/[id]/subcategories/delete-subcategory-dialog.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryListItem } from "@/actions/categories/get-categories";
import { deleteSubcategory } from "@/actions/categories/delete-subcategory";

interface DeleteSubcategoryDialogProps {
  subcategory: CategoryListItem["subcategories"][0] | null;
  onClose: () => void;
}

export function DeleteSubcategoryDialog({ subcategory, onClose }: DeleteSubcategoryDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!subcategory) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSubcategory(subcategory.id);
      if (result.success) {
        toast.success(`Deleted "${subcategory.name}".`);
        onClose();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6 bg-card border border-border rounded-xl shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-destructive mb-4">
          <div className="p-2 bg-destructive/10 rounded-full">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="text-lg font-bold">Delete Subcategory</h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <strong className="text-foreground">{subcategory.name}</strong>? 
          This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={isDeleting} className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2 disabled:opacity-50">
            {isDeleting && <Loader2 className="size-4 animate-spin" />} 
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
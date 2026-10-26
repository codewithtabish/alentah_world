"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Type, Link2, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Import the new action (we will create this next)
import { createSubcategory } from "@/actions/subcategories/create-subcategory";
// Import the schema and types
import { subcategorySchema, SubcategoryFormInput, SubcategoryFormValues } from "@/schemas/subcategory";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
}

export function CreateSubcategorySlideOver({ isOpen, onClose, categoryId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSlugEdited, setIsSlugEdited] = React.useState(false);

  // Use SubcategoryFormInput for the form, SubcategoryFormValues for onSubmit
  const form = useForm<SubcategoryFormInput, any, SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: { 
      name: "", 
      slug: "", 
      description: "", 
      isActive: true, 
      sortOrder: 0 
    },
  });

  const nameValue = useWatch({ control: form.control, name: "name" });
  const descriptionValue = useWatch({ control: form.control, name: "description" });
  const isActiveValue = useWatch({ control: form.control, name: "isActive" }) ?? true;

  // Auto-slug
  React.useEffect(() => {
    if (!isSlugEdited && nameValue) {
      form.setValue("slug", slugify(nameValue));
    }
  }, [nameValue, isSlugEdited, form]);

  // Reset on close
  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
      setIsSlugEdited(false);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: SubcategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createSubcategory({ ...data, categoryId });
      if (result.success) {
        toast.success("Subcategory created.");
        onClose();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-serif font-bold text-foreground">Create Subcategory</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Subcategory Name <span className="text-destructive">*</span></label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("name")} placeholder="e.g. Artificial Intelligence" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Slug <span className="text-destructive">*</span></label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("slug", { onChange: (e) => setIsSlugEdited(e.target.value !== "") })} placeholder="artificial-intelligence" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <textarea {...form.register("description")} placeholder="Brief description..." rows={3} className="w-full p-3 pl-9 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
            </div>
            <p className="text-[10px] text-muted-foreground text-right">{(descriptionValue?.length || 0)}/500</p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-semibold">Status</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => form.setValue("isActive", true)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors", isActiveValue ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border")}>
                <div className={cn("size-2 rounded-full", isActiveValue ? "bg-primary-foreground" : "bg-muted-foreground")} /> Active
              </button>
              <button type="button" onClick={() => form.setValue("isActive", false)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors", !isActiveValue ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border")}>
                <div className={cn("size-2 rounded-full", !isActiveValue ? "bg-primary-foreground" : "bg-muted-foreground")} /> Inactive
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Sort Order</label>
            <input type="number" {...form.register("sortOrder", { valueAsNumber: true })} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
          </div>
        </form>

        <div className="p-4 border-t border-border flex items-center justify-end gap-3 bg-muted/10">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted">Cancel</button>
          <button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 flex items-center gap-2 disabled:opacity-50">
            {isSubmitting && <Loader2 className="size-4 animate-spin" />} Create Subcategory
          </button>
        </div>
      </div>
    </>
  );
}
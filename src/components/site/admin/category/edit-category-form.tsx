// src/app/admin/categories/[id]/edit/edit-category-form.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, UploadCloud, Type, Globe, Link2, FileText, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { updateCategory } from "@/actions/categories/update-category";
import { CategoryListItem } from "@/actions/categories/get-categories";
import { uploadCategoryBannerAction } from "@/actions/images/upload-category-banner-action";
import { categorySchema } from "@/schemas/category";

type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormValues = z.output<typeof categorySchema>;

interface EditCategoryFormProps {
  category: CategoryListItem;
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [hasCopied, setHasCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [uploadedImage, setUploadedImage] = React.useState<{
    url: string;
    name: string;
    originalSize: string;
    uploadedSize: string;
    originalDimensions: string;
    processedDimensions: string;
  } | null>(
    category.coverImage ? {
      url: category.coverImage,
      name: "Existing Cover",
      originalSize: "N/A",
      uploadedSize: "N/A",
      originalDimensions: "N/A",
      processedDimensions: "1600 × 900",
    } : null
  );

  const form = useForm<CategoryFormInput, any, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      languageId: category.language.id,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      coverImage: category.coverImage || "",
    },
  });

  const descriptionValue = useWatch({ control: form.control, name: "description" });
  const isActiveWatched = useWatch({ control: form.control, name: "isActive" });
  const isActiveValue = isActiveWatched ?? true;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    const originalFileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    
    img.onload = async () => {
      const originalDims = `${img.width} × ${img.height}`;
      URL.revokeObjectURL(objectUrl);

      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const result = await uploadCategoryBannerAction(formData);
        if (result.success) {
          setUploadedImage({ 
            url: result.data.url, 
            name: file.name, 
            originalSize: originalFileSize,
            uploadedSize: "Optimized WebP", 
            originalDimensions: originalDims,
            processedDimensions: `${result.data.width} × ${result.data.height}`
          });
          form.setValue("coverImage", result.data.url);
          toast.success("Cover updated.");
        } else {
          toast.error(result.error);
        }
      } catch { toast.error("Upload failed"); } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    img.onerror = () => {
      toast.error("Invalid image file.");
      setIsUploading(false);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const copyToClipboard = () => {
    if (!uploadedImage) return;
    navigator.clipboard.writeText(uploadedImage.url);
    setHasCopied(true);
    toast.success("Image URL copied.");
    setTimeout(() => setHasCopied(false), 2000);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateCategory({ 
        ...data, 
        id: category.id, 
        description: data.description || undefined, 
        coverImage: data.coverImage || undefined 
      });
      
      if (result.success) {
        toast.success("Category updated successfully.");
        router.push("/admin/categories");
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* LEFT COLUMN */}
      <div className="flex-1 w-full space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">Category Information</h2>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Category Name <span className="text-destructive">*</span></label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input {...form.register("name")} className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Language <span className="text-destructive">*</span></label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <select {...form.register("languageId")} disabled className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm outline-none appearance-none disabled:opacity-50">
                  <option value={category.language.id}>{category.language.code.toUpperCase()} — {category.language.name}</option>
                </select>
              </div>
              <p className="text-[10px] text-muted-foreground">Language cannot be changed after creation.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Slug <span className="text-destructive">*</span></label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input {...form.register("slug")} className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <textarea {...form.register("description")} rows={4} className="w-full p-3 pl-9 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
              </div>
              <p className="text-[10px] text-muted-foreground text-right">{(descriptionValue?.length || 0)}/500</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-95 shrink-0 space-y-6">
        
        {/* Cover Banner */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-4">Category Appearance</h2>
          <div className="space-y-3">
            <label className="text-sm font-semibold">Cover Banner</label>
            {uploadedImage ? (
              <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploadedImage.url} alt="Cover" className="w-full h-40 object-cover" />
                  <button type="button" onClick={() => { setUploadedImage(null); form.setValue("coverImage", ""); }} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-destructive text-white rounded-full backdrop-blur-sm">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="font-medium text-foreground">{uploadedImage.processedDimensions}</span>
                  </div>
                  <div className="pt-2 border-t border-border mt-2">
                    <button type="button" onClick={copyToClipboard} className="flex w-full items-center justify-between gap-2 rounded-md bg-background border border-border px-2 py-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                      <span className="truncate">{uploadedImage.url}</span>
                      {hasCopied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-8 cursor-pointer hover:bg-muted/30">
                {isUploading ? <Loader2 className="size-6 animate-spin text-primary" /> : <UploadCloud className="size-8 text-muted-foreground" />}
                <p className="text-sm font-medium text-foreground">Upload cover banner</p>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-4">Publication Settings</h2>
          <div className="space-y-5">
            <div className="space-y-2">
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/categories" className="h-10 rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground hover:bg-muted flex items-center justify-center">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting || isUploading} className="h-10 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </form>
  );
}
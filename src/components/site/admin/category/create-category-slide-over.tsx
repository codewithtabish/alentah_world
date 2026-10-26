"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, UploadCloud, Type, Globe, Link2, FileText, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { createCategory } from "@/actions/categories/create-category";
import { getLanguagesAdmin, LanguageListItem } from "@/actions/language/get-languages";
import { uploadCategoryBannerAction } from "@/actions/images/upload-category-banner-action";
import { categorySchema } from "@/schemas/category";

type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormValues = z.output<typeof categorySchema>;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CreateCategorySlideOver({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  
  // Updated to track both original and uploaded sizes
  const [uploadedImage, setUploadedImage] = React.useState<{
    url: string;
    name: string;
    originalSize: string;
    uploadedSize: string;
    originalDimensions: string;
    processedDimensions: string;
  } | null>(null);

  const [hasCopied, setHasCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isSlugEdited, setIsSlugEdited] = React.useState(false);

  const [languages, setLanguages] = React.useState<LanguageListItem[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = React.useState(true);

  const form = useForm<CategoryFormInput, any, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "", languageId: "", isActive: true, sortOrder: 0, coverImage: "" },
  });

  const nameValue = useWatch({ control: form.control, name: "name" });
  const descriptionValue = useWatch({ control: form.control, name: "description" });
  const isActiveWatched = useWatch({ control: form.control, name: "isActive" });
  const isActiveValue = isActiveWatched ?? true;

  // Fetch languages when opened
  React.useEffect(() => {
    if (isOpen && languages.length === 0) {
      getLanguagesAdmin().then((res) => {
        if (res.success) setLanguages(res.languages);
        setIsLoadingLanguages(false);
      });
    }
  }, [isOpen, languages.length]);

  // Auto-slug
  React.useEffect(() => {
    if (!isSlugEdited && nameValue) {
      form.setValue("slug", slugify(nameValue));
    }
  }, [nameValue, isSlugEdited, form]);

  // Reset form on close
  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
      setUploadedImage(null);
      setIsSlugEdited(false);
      setHasCopied(false);
    }
  }, [isOpen, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Get original dimensions and size
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
          // Calculate the optimized size based on the WebP buffer returned
          // Since we don't have direct access to the buffer size here, 
          // we estimate it or you can add 'size' to the uploadCategoryBannerAction return type.
          // Assuming uploadCategoryBannerAction returns the processed size in the future.
          // For now, we will display a placeholder or estimate if not provided.
          
          setUploadedImage({ 
            url: result.data.url, 
            name: file.name, 
            originalSize: originalFileSize,
            // If your action returns the size, use it. Otherwise, this is a visual placeholder.
            uploadedSize: "Optimized WebP", 
            originalDimensions: originalDims,
            processedDimensions: `${result.data.width} × ${result.data.height}`
          });
          form.setValue("coverImage", result.data.url);
          toast.success("Cover image uploaded.");
        } else {
          toast.error(result.error);
        }
      } catch { 
        toast.error("Upload failed"); 
      } finally {
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
    toast.success("Image URL copied to clipboard.");
    setTimeout(() => setHasCopied(false), 2000);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createCategory({ ...data, description: data.description || undefined, coverImage: data.coverImage || undefined });
      if (result.success) {
        toast.success("Category created.");
        onClose();
        router.refresh();
      } else toast.error(result.error);
    } catch { toast.error("Something went wrong."); } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-serif font-bold text-foreground">Create Category</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
            <X className="size-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category Name <span className="text-destructive">*</span></label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("name")} placeholder="e.g. Technology" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Language <span className="text-destructive">*</span></label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <select {...form.register("languageId")} disabled={isLoadingLanguages} className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm outline-none appearance-none">
                <option value="" disabled>{isLoadingLanguages ? "Loading..." : "Select language"}</option>
                {languages.map((lang) => <option key={lang.id} value={lang.id}>{lang.code.toUpperCase()} — {lang.name}</option>)}
              </select>
            </div>
            {form.formState.errors.languageId && <p className="text-xs text-destructive">{form.formState.errors.languageId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Slug <span className="text-destructive">*</span></label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("slug", { onChange: (e) => setIsSlugEdited(e.target.value !== "") })} placeholder="technology" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <p className="text-[10px] text-muted-foreground">Auto-generated from name. You can edit it.</p>
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

          {/* FULL COVER BANNER UPLOAD */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Cover Banner</label>
            
            {uploadedImage ? (
              <div className="flex flex-col gap-3">
                {/* Image Preview */}
                <div className="relative overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={uploadedImage.url} 
                    alt="Cover Banner" 
                    className="w-full h-40 object-cover" 
                  />
                  <button 
                    type="button" 
                    onClick={() => { setUploadedImage(null); form.setValue("coverImage", ""); }} 
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-destructive text-white rounded-full backdrop-blur-sm transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Metadata Panel */}
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Original Size:</span>
                    <span className="font-medium text-foreground">{uploadedImage.originalDimensions}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Optimized Size:</span>
                    <span className="font-medium text-foreground">{uploadedImage.processedDimensions}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Original Weight:</span>
                    <span className="font-medium text-foreground">{uploadedImage.originalSize}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Uploaded Weight:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{uploadedImage.uploadedSize}</span>
                  </div>
                  
                  {/* URL Copy */}
                  <div className="pt-2 border-t border-border mt-2">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="flex w-full items-center justify-between gap-2 rounded-md bg-background border border-border px-2 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="truncate">{uploadedImage.url}</span>
                      {hasCopied ? <Check className="size-3 text-green-500 shrink-0" /> : <Copy className="size-3 shrink-0" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-8 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="size-6 animate-spin text-primary" />
                ) : (
                  <>
                    <UploadCloud className="size-8 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Upload cover banner</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, or WebP</p>
                    </div>
                  </>
                )}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </div>
            )}
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
            <p className="text-[10px] text-muted-foreground">Lower numbers appear first.</p>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-4 border-t border-border flex items-center justify-end gap-3 bg-muted/10">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted">Cancel</button>
          <button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || isUploading} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 flex items-center gap-2 disabled:opacity-50">
            {isSubmitting && <Loader2 className="size-4 animate-spin" />} Create Category
          </button>
        </div>
      </div>
    </>
  );
}
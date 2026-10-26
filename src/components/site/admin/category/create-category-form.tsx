"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  UploadCloud,
  X,
  Link2,
  Type,
  FileText,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Actions & Types
import { createCategory } from "@/actions/categories/create-category";
// Importing the action directly inside the form
import { getLanguagesAdmin, LanguageListItem } from "@/actions/language/get-languages";
import { uploadCategoryBannerAction } from "@/actions/images/upload-category-banner-action";

// Schema
import { categorySchema } from "@/schemas/category";

// ============================================
// TYPES
// ============================================
type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormValues = z.output<typeof categorySchema>;

// ============================================
// HELPERS
// ============================================
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CreateCategoryForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Languages State (Fetched internally)
  const [languages, setLanguages] = React.useState<LanguageListItem[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = React.useState(true);

  // Image Upload State
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState<{
    url: string;
    name: string;
    size: string;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Use State instead of Ref to track manual slug edits (React Compiler safe)
  const [isSlugEdited, setIsSlugEdited] = React.useState(false);

  const form = useForm<CategoryFormInput, any, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      languageId: "",
      isActive: true,
      sortOrder: 0,
      coverImage: "",
    },
  });

  // ============================================
  // FETCH LANGUAGES ON MOUNT
  // ============================================
  React.useEffect(() => {
    async function fetchLanguages() {
      try {
        const result = await getLanguagesAdmin();
        if (result.success) {
          setLanguages(result.languages);
        } else {
          toast.error(result.error);
        }
      } catch {
        toast.error("Failed to load languages.");
      } finally {
        setIsLoadingLanguages(false);
      }
    }
    fetchLanguages();
  }, []);

  // Watch fields
  const selectedLanguageId = useWatch({ control: form.control, name: "languageId" });
  const nameValue = useWatch({ control: form.control, name: "name" });
  const slugValue = useWatch({ control: form.control, name: "slug" });
  const descriptionValue = useWatch({ control: form.control, name: "description" });
  const isActiveWatched = useWatch({ control: form.control, name: "isActive" });

  const isActiveValue = isActiveWatched ?? true;
  const selectedLanguage = languages.find((l) => l.id === selectedLanguageId);

  // ============================================
  // AUTO-GENERATE SLUG
  // ============================================
  React.useEffect(() => {
    if (!isSlugEdited && nameValue) {
      form.setValue("slug", slugify(nameValue), {
        shouldValidate: form.formState.isSubmitted,
      });
    }
  }, [nameValue, isSlugEdited, form]);

  // ============================================
  // REGISTERED FIELDS
  // ============================================
  const nameField = form.register("name");
  
  const slugField = form.register("slug", {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSlugEdited(e.target.value !== "");
    },
  });

  // ============================================
  // IMAGE UPLOAD HANDLER
  // ============================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadCategoryBannerAction(formData);

      if (result.success) {
        setUploadedImage({
          url: result.data.url,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        });
        form.setValue("coverImage", result.data.url);
        toast.success("Cover image uploaded successfully.");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    form.setValue("coverImage", "");
  };

  // ============================================
  // SUBMIT HANDLER
  // ============================================
  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createCategory({
        ...data,
        description: data.description || undefined,
        coverImage: data.coverImage || undefined,
      });

      if (result.success) {
        toast.success("Category created successfully.");
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

  // If languages are still loading, you can show a skeleton or just disable the select
  // We'll just show a loading state in the select

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row gap-8 items-start"
    >
      {/* LEFT COLUMN */}
      <div className="flex-1 w-full space-y-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">
            Category Information
          </h2>

          <div className="space-y-5">
            {/* Language */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                Language <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <select
                  {...form.register("languageId")}
                  disabled={isLoadingLanguages}
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none appearance-none disabled:opacity-50"
                >
                  <option value="" disabled>
                    {isLoadingLanguages ? "Loading languages..." : "Select language"}
                  </option>
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.code.toUpperCase()} — {lang.name} ({lang.nativeName}) — {lang.direction}
                    </option>
                  ))}
                </select>
              </div>
              {form.formState.errors.languageId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.languageId.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                Category Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  {...nameField}
                  placeholder="e.g. Technology"
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                Slug <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  {...slugField}
                  placeholder="e.g. technology"
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              {form.formState.errors.slug && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Description (optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <textarea
                  {...form.register("description")}
                  placeholder="Briefly describe the topics covered by this category..."
                  rows={4}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                />
              </div>
              <div className="flex justify-between text-xs">
                <p className="text-muted-foreground">A short description helps with discovery.</p>
                <p className="text-muted-foreground">{descriptionValue?.length || 0}/500</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-95 shrink-0 space-y-6">
        {/* Appearance */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-4">
            Category Appearance
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Cover Image (optional)
            </label>

            {uploadedImage ? (
              <div className="relative rounded-md border border-border p-3 flex items-center gap-3 bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={uploadedImage.url} alt="Cover" className="size-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadedImage.name}</p>
                  <p className="text-xs text-muted-foreground">{uploadedImage.size}</p>
                  <a href={uploadedImage.url} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline truncate block">
                    Open image
                  </a>
                </div>
                <button type="button" onClick={removeImage} aria-label="Remove image" className="p-1 text-muted-foreground hover:text-destructive">
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 py-8 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="size-6 animate-spin text-primary" />
                ) : (
                  <>
                    <UploadCloud className="size-8 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Upload category cover</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, or WebP</p>
                    </div>
                    <span className="mt-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium">
                      Browse Files
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            )}
          </div>
        </div>

        {/* Publication Settings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-4">
            Publication Settings
          </h2>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Status</label>
              <div className="flex rounded-md border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => form.setValue("isActive", true)}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium transition-colors",
                    isActiveValue ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue("isActive", false)}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium transition-colors",
                    !isActiveValue ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Inactive
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Sort Order</label>
              <input
                type="number"
                {...form.register("sortOrder", { valueAsNumber: true })}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-foreground">Preview</h2>
            <span className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" /> Live
            </span>
          </div>

          <div className="rounded-lg border border-border p-4 flex gap-4 bg-muted/10">
            {uploadedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={uploadedImage.url} alt="Preview" className="size-16 rounded object-cover shrink-0" />
            ) : (
              <div className="size-16 rounded bg-muted flex items-center justify-center shrink-0">
                <Globe className="size-6 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold text-foreground truncate">
                {nameValue || "Category Name"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                  {selectedLanguage?.code || "EN"}
                </span>
                <span className="text-xs text-muted-foreground">{selectedLanguage?.name || "English"}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                {descriptionValue || "A brief description of the category."}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2 truncate">
                /{slugValue || "slug"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/categories"
            className="h-10 rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground hover:bg-muted flex items-center justify-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isUploading || isLoadingLanguages}
            className="h-10 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </div>
    </form>
  );
}
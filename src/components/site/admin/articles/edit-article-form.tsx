// src/components/site/admin/articles/edit-article-form.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Loader2, Upload, X, Check, PenLine, Eye, User 
} from "lucide-react";

import { cn } from "@/lib/utils";
import { updateArticleAction } from "@/actions/articles/update-article";
import { uploadBannerAction } from "@/actions/images/upload-banner-action";
import { uploadOgAction } from "@/actions/images/upload-og-action";
import { uploadEditorAction } from "@/actions/images/upload-editor-image-action"; 
import { CategoryListItem } from "@/actions/categories/get-categories";
import { LanguageListItem } from "@/actions/language/get-languages";
import ArticleEditor from "./article-editor";
import { ArticlePreviewer } from "./article-previewer";


type TocItem = { id: string; title: string; slug: string; level?: number };

interface EditArticleFormProps {
  languages: LanguageListItem[];
  categories: CategoryListItem[];
  initialData: any; // Replace with proper type
}

const TYPES = ["ARTICLE", "NEWS", "OPINION", "ANALYSIS", "GUIDE", "REVIEW", "INTERVIEW"] as const;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function EditArticleForm({ languages, categories, initialData }: EditArticleFormProps) {
  const router = useRouter();

  // --- STATE (Pre-filled from initialData) ---
  const [activeTab, setActiveTab] = React.useState<"write" | "preview">("write");
  
  const [title, setTitle] = React.useState(initialData.title);
  const [slug, setSlug] = React.useState(initialData.slug);
  const [slugEdited, setSlugEdited] = React.useState(true);
  const [content, setContent] = React.useState<{ blocks: any[] }>(initialData.content || { blocks: [] });
  const [toc, setToc] = React.useState<TocItem[]>(initialData.tableOfContents || []);

  const [languageId, setLanguageId] = React.useState(initialData.languageId);
  const [categoryId, setCategoryId] = React.useState(initialData.categoryId);
  const [subcategoryId, setSubcategoryId] = React.useState(initialData.subcategoryId);
  
  const [writtenBy, setWrittenBy] = React.useState(initialData.writtenBy || "");
  const [writerImageUrl, setWriterImageUrl] = React.useState(initialData.writerImageUrl || "");
  const [uploadingWriter, setUploadingWriter] = React.useState(false);

  const [bannerImage, setBannerImage] = React.useState(initialData.bannerImage);
  const [ogImage, setOgImage] = React.useState(initialData.seo?.ogImage || initialData.bannerImage);
  const [uploadingBanner, setUploadingBanner] = React.useState(false);
  const [uploadingOg, setUploadingOg] = React.useState(false);

  const [type, setType] = React.useState<string>(initialData.type);
  const [status, setStatus] = React.useState<string>(initialData.status);
  const [featured, setFeatured] = React.useState(initialData.featured);
  const [submitting, setSubmitting] = React.useState(false);

  const bannerRef = React.useRef<HTMLInputElement>(null);
  const ogRef = React.useRef<HTMLInputElement>(null);
  const writerRef = React.useRef<HTMLInputElement>(null);

  const selectedLanguage = languages.find((l) => l.id === languageId);
  const isRTL = selectedLanguage?.direction === "RTL";

  const availableCategories = React.useMemo(() => {
    return categories.filter((c) => c.language.id === languageId);
  }, [categories, languageId]);

  const selectedCategory = availableCategories.find((c) => c.id === categoryId);
  const availableSubcategories = selectedCategory?.subcategories || [];

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) setSlug(slugify(val));
  };

  const handleLanguageChange = (val: string) => {
    setLanguageId(val);
    setCategoryId("");
    setSubcategoryId("");
  };

  const handleCategoryChange = (val: string) => {
    setCategoryId(val);
    setSubcategoryId("");
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return toast.error("Invalid image type.");
    
    setUploadingBanner(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadBannerAction(formData);
      if (res.success) {
        setBannerImage(res.data.url);
        toast.success("Banner uploaded.");
      } else toast.error(res.error);
    } catch { toast.error("Upload failed."); } finally {
      setUploadingBanner(false);
      if (bannerRef.current) bannerRef.current.value = "";
    }
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return toast.error("Invalid image type.");
    
    setUploadingOg(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadOgAction(formData);
      if (res.success) {
        setOgImage(res.data.url);
        toast.success("OG image uploaded.");
      } else toast.error(res.error);
    } catch { toast.error("Upload failed."); } finally {
      setUploadingOg(false);
      if (ogRef.current) ogRef.current.value = "";
    }
  };

  const handleWriterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return toast.error("Invalid image type.");
    
    setUploadingWriter(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadEditorAction(formData);
      if (res.success) {
        setWriterImageUrl(res.data.url);
        toast.success("Author photo uploaded.");
      } else toast.error(res.error);
    } catch { toast.error("Upload failed."); } finally {
      setUploadingWriter(false);
      if (writerRef.current) writerRef.current.value = "";
    }
  };

  const addTocItem = () => setToc((prev) => [...prev, { id: crypto.randomUUID(), title: "", slug: "", level: 2 }]);
  const updateTocItem = (id: string, field: keyof TocItem, value: string | number) => {
    setToc((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "title" && typeof value === "string") updated.slug = slugify(value);
      return updated;
    }));
  };
  const removeTocItem = (id: string) => setToc((prev) => prev.filter((i) => i.id !== id));

  const handleSubmit = async (newStatus: "DRAFT" | "PUBLISHED") => {
    if (!title.trim() || !slug.trim()) return toast.error("Title and slug are required.");
    if (!bannerImage || !ogImage) return toast.error("Banner and OG images are required.");
    if (!languageId || !categoryId || !subcategoryId) return toast.error("Please select language, category, and subcategory.");
    if (!content.blocks.length) return toast.error("Content cannot be empty.");

    setSubmitting(true);
    const toastId = toast.loading(newStatus === "PUBLISHED" ? "Publishing..." : "Saving...");

    try {
      const result = await updateArticleAction({
        id: initialData.id,
        title: title.trim(),
        slug: slug.trim(),
        content,
        bannerImage,
        bannerImageAlt: title.trim(),
        ogImage,
        languageId,
        categoryId,
        subcategoryId,
        writtenBy: writtenBy.trim() || undefined,
        writerImageUrl: writerImageUrl || undefined,
        type,
        status: newStatus, // Uses the button clicked
        featured,
        tableOfContents: toc.filter((t) => t.title.trim()),
      });

      if (result.success) {
        toast.success(newStatus === "PUBLISHED" ? "Article published!" : "Draft saved!", { id: toastId });
        router.push("/admin/articles");
        router.refresh();
      } else {
        toast.error(result.error, { id: toastId });
      }
    } catch {
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]" dir="ltr">
      
      {/* LEFT COLUMN: WRITE / PREVIEW */}
      <div className="min-w-0">
        
        {/* TABS */}
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-border">
          <div className="flex gap-1">
            <button type="button" onClick={() => setActiveTab("write")} className={cn("inline-flex h-10 items-center gap-2 px-4 border-b-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors", activeTab === "write" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <PenLine className="h-3.5 w-3.5" /> Write
            </button>
            <button type="button" onClick={() => setActiveTab("preview")} className={cn("inline-flex h-10 items-center gap-2 px-4 border-b-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors", activeTab === "preview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>
        </div>

        {activeTab === "write" ? (
          <div className="space-y-6">
            
            {/* TITLE BLOCK */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article Title..."
                className={cn("w-full border-0 bg-transparent p-0 font-serif text-3xl tracking-tight sm:text-4xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none", isRTL && "font-urdu-display text-right")}
                dir={isRTL ? "rtl" : "ltr"} 
              />
              <div className="mt-4 flex items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center">
                  <span className="inline-flex h-9 shrink-0 items-center rounded-s-lg border border-e-0 border-border bg-muted px-3 font-mono text-[11px] text-muted-foreground">
                    /{selectedLanguage?.code || "lang"}/{selectedCategory?.slug || "cat"}/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => { setSlugEdited(true); setSlug(slugify(e.target.value)); }}
                    className="h-9 min-w-0 flex-1 rounded-e-lg border border-border bg-background px-3 font-mono text-[12px] focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* EDITOR.JS */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <ArticleEditor value={content} onChange={setContent} />
            </div>

            {/* MEDIA */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Media</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* BANNER */}
                <div>
                  <p className="mb-2 text-[11px] font-medium">Banner Image</p>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40 hover:border-primary/50 transition-colors">
                    {bannerImage ? (
                      <>
                        <Image src={bannerImage} alt="Banner" fill className="object-cover" />
                        <button type="button" onClick={() => setBannerImage("")} className="absolute right-2 top-2 p-1.5 bg-black/60 hover:bg-destructive text-white rounded-full"><X className="size-4" /></button>
                      </>
                    ) : (
                      <button type="button" onClick={() => bannerRef.current?.click()} disabled={uploadingBanner} className="flex h-full w-full flex-col items-center justify-center gap-2">
                        {uploadingBanner ? <Loader2 className="size-5 animate-spin text-primary" /> : <Upload className="size-5 text-muted-foreground" />}
                        <span className="text-[11px] text-muted-foreground">Upload banner</span>
                      </button>
                    )}
                  </div>
                  <input type="file" ref={bannerRef} onChange={handleBannerUpload} className="hidden" accept="image/*" />
                </div>

                {/* OG IMAGE */}
                <div>
                  <p className="mb-2 text-[11px] font-medium">OG Image</p>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40 hover:border-primary/50 transition-colors">
                    {ogImage ? (
                      <>
                        <Image src={ogImage} alt="OG" fill className="object-cover" />
                        <button type="button" onClick={() => setOgImage("")} className="absolute right-2 top-2 p-1.5 bg-black/60 hover:bg-destructive text-white rounded-full"><X className="size-4" /></button>
                      </>
                    ) : (
                      <button type="button" onClick={() => ogRef.current?.click()} disabled={uploadingOg} className="flex h-full w-full flex-col items-center justify-center gap-2">
                        {uploadingOg ? <Loader2 className="size-5 animate-spin text-primary" /> : <Upload className="size-5 text-muted-foreground" />}
                        <span className="text-[11px] text-muted-foreground">Upload OG</span>
                      </button>
                    )}
                  </div>
                  <input type="file" ref={ogRef} onChange={handleOgUpload} className="hidden" accept="image/*" />
                </div>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleSubmit("DRAFT")} disabled={submitting} className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-5 text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-accent disabled:opacity-50">Save Draft</button>
                <button type="button" onClick={() => handleSubmit("PUBLISHED")} disabled={submitting} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Update & Publish
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="min-w-0">
            {bannerImage && (
              <div className="relative mb-8 aspect-21/9-full overflow-hidden rounded-2xl border border-border">
                <Image src={bannerImage} alt="Banner" fill className="object-cover" />
              </div>
            )}
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              {selectedCategory?.name || "Category"} · {availableSubcategories.find(s => s.id === subcategoryId)?.name || "Subcategory"}
            </p>
            <h1 className={cn("mb-6 font-serif text-3xl tracking-tight text-foreground sm:text-4xl", isRTL && "font-urdu-display text-right")}>
              {title || "Untitled Article"}
            </h1>
            <ArticlePreviewer content={content} language={selectedLanguage?.code as any} tableOfContents={toc} />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: SETTINGS */}
      <aside className="h-fit space-y-6 xl:sticky xl:top-24">
        
        {/* CLASSIFICATION */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Classification</h2>
          <div className="space-y-4">
            
            <div>
              <label className="mb-2 block text-[11px] font-medium">Language</label>
              <select value={languageId} onChange={(e) => handleLanguageChange(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[12px]">
                {languages.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.code})</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium">Category</label>
              <select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[12px]">
                <option value="">Select Category</option>
                {availableCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium">Subcategory</label>
              <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} disabled={!categoryId} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[12px] disabled:opacity-50">
                <option value="">Select Subcategory</option>
                {availableSubcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-medium">Article Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[12px]">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-3 pt-2">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4 accent-primary" />
              <span className="text-[12px]">Feature on Homepage</span>
            </label>
          </div>
        </div>

        {/* GUEST AUTHOR */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Guest Author</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-medium">Author Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input value={writtenBy} onChange={(e) => setWrittenBy(e.target.value)} placeholder="e.g. Mir Hasan" className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-[12px]" />
              </div>
            </div>

            {writtenBy.trim() && (
              <div>
                <label className="mb-2 block text-[11px] font-medium">Author Photo</label>
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                    {writerImageUrl ? (
                      <Image src={writerImageUrl} alt="Author" fill className="object-cover" />
                    ) : (
                      <User className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => writerRef.current?.click()} 
                    disabled={uploadingWriter}
                    className="flex h-8 items-center gap-2 rounded-md border border-border bg-background px-3 text-[11px] font-medium hover:bg-muted"
                  >
                    {uploadingWriter ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
                    Upload Photo
                  </button>
                  <input type="file" ref={writerRef} onChange={handleWriterUpload} className="hidden" accept="image/*" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">TOC</h2>
            <button type="button" onClick={addTocItem} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-[10px] font-semibold uppercase text-muted-foreground hover:bg-primary/5 hover:text-primary">
              Add
            </button>
          </div>
          {toc.map((item) => (
            <div key={item.id} className="flex items-center gap-2 mb-2">
              <input value={item.title} onChange={(e) => updateTocItem(item.id, "title", e.target.value)} placeholder="Heading" className="h-8 w-full rounded border border-border bg-background px-2 text-[11px]" />
              <button type="button" onClick={() => removeTocItem(item.id)} className="text-destructive hover:opacity-70"><X className="size-4" /></button>
            </div>
          ))}
        </div>

      </aside>
    </div>
  );
}
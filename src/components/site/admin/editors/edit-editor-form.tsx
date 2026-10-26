// src/app/admin/editors/[id]/edit-editor-form.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  X, Loader2, User, Mail, Briefcase, FileText, Check, ChevronDown, Layers, Image as ImageIcon,
  Globe, ArrowLeft, Save
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import { updateEditor } from "@/actions/editors/update-editor";
import { uploadEditorAction } from "@/actions/images/upload-editor-image-action";
import { getCategories, CategoryListItem } from "@/actions/categories/get-categories";
import { editorSchema, EditorFormInput, EditorFormValues } from "@/schemas/editor";
import { EditorListItem } from "@/actions/editors/get-editors";
import { GithubIcon, GlobeIcon, InstagramIcon, LinkedinIcon, XIcon } from "../../general/theme/social-icons";



interface EditEditorFormProps {
  editor: EditorListItem;
}

export function EditEditorForm({ editor }: EditEditorFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(editor.imageUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [categories, setCategories] = React.useState<CategoryListItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<EditorFormInput, any, EditorFormValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      name: editor.name,
      email: editor.email,
      experience: editor.experience || "",
      bio: editor.bio || "",
      imageUrl: editor.imageUrl || "",
      website: editor.website || "",
      twitter: editor.twitter || "",
      linkedin: editor.linkedin || "",
      instagram: editor.instagram || "",
      github: editor.github || "",
      categoryIds: editor.categories.map((c) => c.id),
    },
  });

  const bioValue = useWatch({ control: form.control, name: "bio" });
  const selectedCategoryIds = useWatch({ control: form.control, name: "categoryIds" }) || [];

  // Fetch Categories on mount
  React.useEffect(() => {
    setIsLoadingCategories(true);
    getCategories().then((res) => {
      if (res.success) {
        setCategories(res.categories);
      } else {
        toast.error("Failed to load categories.");
      }
      setIsLoadingCategories(false);
    });
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const result = await uploadEditorAction(formData);
      if (result.success) {
        setUploadedImage(result.data.url);
        form.setValue("imageUrl", result.data.url);
        toast.success("Avatar updated.");
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

  const toggleCategory = (id: string) => {
    const current = form.getValues("categoryIds") || [];
    if (current.includes(id)) {
      form.setValue("categoryIds", current.filter((c) => c !== id));
    } else {
      form.setValue("categoryIds", [...current, id]);
    }
  };

  const onSubmit = async (data: EditorFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateEditor(editor.id, data);
      if (result.success) {
        toast.success("Editor profile updated.");
        router.push("/admin/editors");
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 items-start w-full">
      
      {/* LEFT COLUMN: Main Details */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Avatar & Basic Info */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-border">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {uploadedImage ? (
                <>
                  <Image src={uploadedImage} alt="Avatar" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ImageIcon className="size-6 text-white" />
                  </div>
                </>
              ) : isUploading ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : (
                <User className="size-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-foreground">Profile Avatar</h3>
              <p className="text-xs text-muted-foreground mt-1">Click to upload a new headshot. Max 5MB.</p>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          {/* Name & Email Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Full Name <span className="text-destructive">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input {...form.register("name")} className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address <span className="text-destructive">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input {...form.register("email")} className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
              </div>
              {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Role / Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("experience")} placeholder="e.g. Editor-in-Chief, Senior Editor" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Biography</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <textarea {...form.register("bio")} rows={4} className="w-full p-3 pl-9 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
            </div>
            <p className="text-[10px] text-muted-foreground text-right">{(bioValue?.length || 0)}/500</p>
          </div>
        </div>

        {/* Social Profiles */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-serif font-bold text-foreground mb-2 flex items-center gap-2">
            <GlobeIcon className="size-5 text-muted-foreground" /> Social Profiles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("website")} placeholder="Website URL" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="relative">
              <XIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("twitter")} placeholder="Twitter / X handle" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="relative">
              <LinkedinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("linkedin")} placeholder="LinkedIn URL" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="relative">
              <InstagramIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("instagram")} placeholder="Instagram handle" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="relative">
              <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("github")} placeholder="GitHub username" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Settings */}
      <div className="w-full lg:w-95 shrink-0 space-y-6">
        
        {/* Categories */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2">
            <Layers className="size-5 text-muted-foreground" /> Assigned Categories
          </h3>
          
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-background p-1.5 px-3 text-sm cursor-pointer hover:bg-muted/10"
            >
              {isLoadingCategories ? (
                <span className="text-muted-foreground text-sm py-1 flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin" /> Loading...
                </span>
              ) : selectedCategoryIds.length === 0 ? (
                <span className="text-muted-foreground text-sm py-1">Select categories...</span>
              ) : (
                selectedCategoryIds.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  if (!cat) return null;
                  return (
                    <span key={id} className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                      {cat.name}
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleCategory(id); }}
                        className="hover:text-white/80"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  );
                })
              )}
              <ChevronDown className="ml-auto size-4 text-muted-foreground shrink-0" />
            </div>

            {isDropdownOpen && !isLoadingCategories && (
              <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
                {categories.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">No categories found.</div>
                ) : (
                  categories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                      >
                        <div className={cn("flex size-4 items-center justify-center rounded border", isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border")}>
                          {isSelected && <Check className="size-3" />}
                        </div>
                        <span>{cat.name}</span>
                        <span className="ml-auto text-[10px] font-bold uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{cat.language.code}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Select the categories this editor is responsible for.</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link 
            href="/admin/editors"
            className="h-11 rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground hover:bg-muted flex items-center justify-center"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting || isUploading}
            className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </form>
  );
}
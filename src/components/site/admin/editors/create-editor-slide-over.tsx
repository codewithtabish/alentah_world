// src/components/site/admin/editors/create-editor-slide-over.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  X, Loader2, User, Mail, Briefcase, FileText, Check, ChevronDown, Layers, Image as ImageIcon 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { createEditor } from "@/actions/editors/create-editor";
import { uploadEditorAction } from "@/actions/images/upload-editor-image-action";
import { getCategories, CategoryListItem } from "@/actions/categories/get-categories";
import { editorSchema, EditorFormInput, EditorFormValues } from "@/schemas/editor";
import { GithubIcon, GlobeIcon, InstagramIcon, LinkedinIcon, XIcon } from "../../general/theme/social-icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEditorSlideOver({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [categories, setCategories] = React.useState<CategoryListItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<EditorFormInput, any, EditorFormValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: { 
      name: "", email: "", experience: "", bio: "", imageUrl: "", 
      website: "", twitter: "", linkedin: "", instagram: "", github: "",
      categoryIds: [] 
    },
  });

  const bioValue = useWatch({ control: form.control, name: "bio" });
  const selectedCategoryIds = useWatch({ control: form.control, name: "categoryIds" }) || [];

  // ============================================================
  // FILTER LOGIC: Only show categories that have NO editor assigned
  // ============================================================
  const availableCategories = React.useMemo(() => {
    return categories.filter(cat => !cat.editor);
  }, [categories]);

  // Fetch Categories when opened
  React.useEffect(() => {
    if (isOpen && categories.length === 0) {
      setIsLoadingCategories(true);
      getCategories().then((res) => {
        if (res.success) {
          setCategories(res.categories);
        } else {
          toast.error("Failed to load categories.");
        }
        setIsLoadingCategories(false);
      });
    }
  }, [isOpen, categories.length]);

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

  // Reset on close
  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
      setUploadedImage(null);
      setIsDropdownOpen(false);
    }
  }, [isOpen, form]);

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
        toast.success("Avatar uploaded.");
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
      const result = await createEditor(data);
      if (result.success) {
        toast.success("Editor added to the team.");
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
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">Add Editor</h2>
            <p className="text-xs text-muted-foreground mt-1">Invite a new editor to your publication.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
            <X className="size-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
          
          {/* AVATAR UPLOAD */}
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group flex size-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {uploadedImage ? (
                <>
                  <Image src={uploadedImage} alt="Avatar" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ImageIcon className="size-5 text-white" />
                  </div>
                </>
              ) : isUploading ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : (
                <User className="size-8 text-muted-foreground" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Upload Avatar</span>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          </div>

          {/* FULL NAME */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Full Name <span className="text-destructive">*</span></label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("name")} placeholder="e.g. Sarah Mitchell" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email Address <span className="text-destructive">*</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("email")} placeholder="name@domain.com" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          {/* ROLE/TITLE */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Role / Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input {...form.register("experience")} placeholder="e.g. Editor-in-Chief, Senior Editor" className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>

          {/* BIOGRAPHY */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Biography</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <textarea {...form.register("bio")} placeholder="Tell us about the editor's background..." rows={4} className="w-full p-3 pl-9 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
            </div>
            <p className="text-[10px] text-muted-foreground text-right">{(bioValue?.length || 0)}/500</p>
          </div>

          {/* SOCIAL PROFILES */}
          <div className="space-y-3 pt-2 border-t border-border">
            <label className="text-sm font-semibold flex items-center gap-2">
              <GlobeIcon className="size-4 text-muted-foreground" /> Social Profiles
            </label>
            
            <div className="grid grid-cols-1 gap-3">
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

          {/* CUSTOM MULTI-SELECT CATEGORIES (Filtered) */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Layers className="size-4 text-muted-foreground" /> Assign Categories
            </label>
            
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

              {/* DROPDOWN MENU (Using availableCategories) */}
              {isDropdownOpen && !isLoadingCategories && (
                <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
                  {availableCategories.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">All categories are currently assigned.</div>
                  ) : (
                    availableCategories.map((cat) => {
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
            <p className="text-[10px] text-muted-foreground">Only unassigned categories are shown.</p>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-4 border-t border-border bg-muted/10">
          <button 
            type="button" 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting || isUploading} 
            className="flex w-full h-11 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />} 
            Save Editor
          </button>
        </div>
      </div>
    </>
  );
}
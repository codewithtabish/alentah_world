"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, FileText, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { EditorListItem } from "@/actions/editors/get-editors";
import { CreateEditorSlideOver } from "./create-editor-slide-over";
import { DeleteEditorDialog } from "./delete-editor-dialog";

interface EditorsClientProps {
  initialEditors: EditorListItem[];
}

export function EditorsClient({ initialEditors }: EditorsClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editorToDelete, setEditorToDelete] = React.useState<EditorListItem | null>(null);

  const allCategories = Array.from(new Set(initialEditors.flatMap((e) => e.categories.map((c) => c.name))));
  const allRoles = Array.from(new Set(initialEditors.map((e) => e.experience).filter(Boolean)));

  const filteredEditors = initialEditors.filter((editor) => {
    const matchesSearch = editor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || editor.experience === roleFilter;
    const matchesCategory = categoryFilter === "all" || editor.categories.some(c => c.name === categoryFilter);
    return matchesSearch && matchesRole && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Editorial Team</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your editorial team.</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="size-4" /> Add Editor
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input type="text" placeholder="Search editors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-10 px-3 rounded-md border border-border bg-background text-sm outline-none">
          <option value="all">All Roles</option>
          {allRoles.map((role) => <option key={role} value={role as string}>{role}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 px-3 rounded-md border border-border bg-background text-sm outline-none">
          <option value="all">All Categories</option>
          {allCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEditors.map((editor) => (
          <div key={editor.id} className="group relative flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 hover:shadow-sm transition-all">
            
            {/* ACTIONS MENU */}
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Link href={`/admin/editors/${editor.id}`} className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-muted" title="Edit">
                <Edit className="size-4" />
              </Link>
              <button onClick={() => setEditorToDelete(editor)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted" title="Delete">
                <Trash2 className="size-4" />
              </button>
            </div>

            {/* AVATAR */}
            <div className="relative mb-4 size-20 overflow-hidden rounded-full border-2 border-background shadow-sm">
              {editor.imageUrl ? (
                <Image src={editor.imageUrl} alt={editor.name} fill sizes="80px" className="object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-primary/10 text-primary text-2xl font-serif font-bold">{editor.name.charAt(0)}</div>
              )}
            </div>

            <h3 className="text-lg font-serif font-bold text-foreground">{editor.name}</h3>
            <p className="text-xs font-medium text-primary mb-4">{editor.experience || "Editor"}</p>

            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {editor.categories.length === 0 ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground border border-border">Unassigned</span>
              ) : (
                editor.categories.slice(0, 3).map((cat) => (
                  <span key={cat.id} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground border border-border/50">{cat.name}</span>
                ))
              )}
            </div>

            <Link href={`/admin/editors/${editor.id}`} className="mt-auto flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary">
              <FileText className="size-3.5" /> View Profile
            </Link>
          </div>
        ))}
      </div>

      <CreateEditorSlideOver isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <DeleteEditorDialog editor={editorToDelete} onClose={() => setEditorToDelete(null)} />
    </div>
  );
}
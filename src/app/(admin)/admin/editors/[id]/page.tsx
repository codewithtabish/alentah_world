// src/app/admin/editors/[id]/page.tsx

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getEditorById } from "@/actions/editors/get-editor-by-id";
import { EditEditorForm } from "@/components/site/admin/editors/edit-editor-form";

export const metadata = {
  title: "Edit Editor | Admin",
};

export default function EditEditorPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <React.Suspense fallback={<EditEditorSkeleton />}>
        <EditorDataFetcher params={params} />
      </React.Suspense>
    </div>
  );
}

async function EditorDataFetcher({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const result = await getEditorById(id);

  if (!result.success) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
          <p className="font-semibold">Failed to load editor</p>
          <p className="text-sm mt-1">{result.error}</p>
          <Link 
            href="/admin/editors" 
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            <ChevronLeft className="size-3" /> Back to Editors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Link 
          href="/admin/editors" 
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ChevronLeft className="size-3" />
          Back to Editors
        </Link>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          Edit Editor Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Update the details, roles, and social profiles for this editor.
        </p>
      </div>

      <EditEditorForm editor={result.editor} />
    </>
  );
}

function EditEditorSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      <div className="flex flex-col gap-1">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-9 w-64 bg-muted rounded-md" />
        <div className="h-4 w-96 bg-muted rounded-md mt-1" />
      </div>
      <div className="rounded-xl border border-border bg-card p-6 h-150">
        <div className="h-6 w-48 bg-muted rounded mb-6" />
        <div className="space-y-5">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
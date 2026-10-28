// src/app/(admin)/admin/articles/[id]/edit/page.tsx
import { getArticleByIdAdmin } from "@/actions/articles/get-article-by-id";
import { getCategories } from "@/actions/categories/get-categories";
import { getLanguagesAdmin } from "@/actions/language/get-languages";
import { EditArticleForm } from "@/components/site/admin/articles/edit-article-form";
import { notFound } from "next/navigation";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [articleRes, categoriesRes, languagesRes] = await Promise.all([
    getArticleByIdAdmin(id),
    getCategories(),
    getLanguagesAdmin(),
  ]);

  if (!articleRes.success || !categoriesRes.success || !languagesRes.success) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          Edit Article
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update the article content, images, and SEO settings.
        </p>
      </div>

      <EditArticleForm 
        initialData={articleRes.article}
        categories={categoriesRes.categories}
        languages={languagesRes.languages}
      />
    </div>
  );
}
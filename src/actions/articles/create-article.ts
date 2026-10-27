"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/clients/prisma-client";
import { CACHE_TAGS } from "@/lib/cache-keys";
import {
  createFallbackSEO,
  generateSEO,
  type SEOLanguage,
  type SEOResult,
} from "@/lib/articles/generate-seo";

export type CreateArticleInput = {
  title: string;
  slug: string;
  content: {
    blocks: Array<Record<string, unknown>>;
  };
  bannerImage: string;
  bannerImageAlt?: string;
  ogImage: string;
  languageId: string;
  categoryId: string;
  subcategoryId: string;
  writtenBy?: string;
  writerImageUrl?: string;
  type?: string;
  status?: string;
  featured?: boolean;
  scheduledAt?: string | null;
  tableOfContents?: {
    id: string;
    title: string;
    slug: string;
    level?: number;
  }[];
};

export type CreateArticleResult =
  | {
      success: true;
      data: {
        articleId: string;
        slug: string;
        status: string;
      };
    }
  | {
      success: false;
      error: string;
      field?: string;
    };

const SUPPORTED_LANGUAGES = new Set<SEOLanguage>([
  "en",
  "ur",
  "ar",
]);

function extractTextFromContent(content: {
  blocks: Array<Record<string, unknown>>;
}): string {
  if (!Array.isArray(content?.blocks)) {
    return "";
  }

  return content.blocks
    .map((block) => {
      const data = block.data as
        | Record<string, unknown>
        | undefined;

      if (!data) {
        return "";
      }

      const blockType = String(block.type ?? "");

      if (["paragraph", "aitext"].includes(blockType)) {
        return String(data.text ?? "");
      }

      if (blockType === "header") {
        const requestedLevel = Number(data.level);
        const level = Number.isFinite(requestedLevel)
          ? Math.min(6, Math.max(1, Math.floor(requestedLevel)))
          : 2;

        return `${"#".repeat(level)} ${String(data.text ?? "")}`;
      }

      if (["list", "checklist", "nestedlist"].includes(blockType)) {
        const items = Array.isArray(data.items) ? data.items : [];

        return items
          .map((item: unknown) => {
            if (typeof item === "string") {
              return item;
            }

            if (typeof item !== "object" || item === null) {
              return "";
            }

            const entry = item as {
              content?: unknown;
              text?: unknown;
              items?: unknown[];
            };

            const ownText =
              typeof entry.content === "string"
                ? entry.content
                : typeof entry.text === "string"
                  ? entry.text
                  : "";

            const nestedText = Array.isArray(entry.items)
              ? entry.items
                  .map((nestedItem) => {
                    if (typeof nestedItem === "string") {
                      return nestedItem;
                    }

                    if (
                      typeof nestedItem === "object" &&
                      nestedItem !== null
                    ) {
                      const nested = nestedItem as {
                        content?: unknown;
                        text?: unknown;
                      };

                      return typeof nested.content === "string"
                        ? nested.content
                        : typeof nested.text === "string"
                          ? nested.text
                          : "";
                    }

                    return "";
                  })
                  .filter(Boolean)
                  .join("\n")
              : "";

            return [ownText, nestedText].filter(Boolean).join("\n");
          })
          .filter(Boolean)
          .join("\n");
      }

      if (blockType === "quote") {
        return String(data.text ?? "");
      }

      if (blockType === "raw") {
        return String(data.html ?? "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      return "";
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function estimateReadingTime(content: {
  blocks: Array<Record<string, unknown>>;
}): number {
  const text = extractTextFromContent(content);
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

export async function createArticleAction(
  data: CreateArticleInput,
): Promise<CreateArticleResult> {
  try {
    // 1. Authentication
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        error: "You must be signed in to create an article.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return {
        success: false,
        error: "Your user account could not be found.",
      };
    }

    // 2. Basic validation
    if (!data.title?.trim() || !data.slug?.trim()) {
      return {
        success: false,
        error: "Title and slug are required.",
      };
    }

    if (!data.languageId || !data.categoryId || !data.subcategoryId) {
      return {
        success: false,
        error: "Language, category, and subcategory are required.",
      };
    }

    if (!data.bannerImage?.trim() || !data.ogImage?.trim()) {
      return {
        success: false,
        error: "Banner image and social sharing image are required.",
      };
    }

    if (!Array.isArray(data.content?.blocks) || data.content.blocks.length === 0) {
      return {
        success: false,
        error: "Article content is empty.",
        field: "content",
      };
    }

    if (
      data.scheduledAt &&
      !Number.isFinite(new Date(data.scheduledAt).getTime())
    ) {
      return {
        success: false,
        error: "Please provide a valid scheduled publication date.",
        field: "scheduledAt",
      };
    }

    // 3. Check article slug uniqueness
    const conflict = await prisma.blog.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (conflict) {
      return {
        success: false,
        error: "This article slug is already in use.",
        field: "slug",
      };
    }

    // 4. Verify category, subcategory, and language relationship
    const subcategory = await prisma.subcategory.findFirst({
      where: {
        id: data.subcategoryId,
        categoryId: data.categoryId,
        isActive: true,
      },
      include: {
        category: {
          include: {
            language: true,
          },
        },
      },
    });

    if (!subcategory || !subcategory.category.isActive) {
      return {
        success: false,
        error: "The selected category or subcategory is invalid or inactive.",
        field: "subcategoryId",
      };
    }

    if (subcategory.category.languageId !== data.languageId) {
      return {
        success: false,
        error: "The selected category does not belong to this language.",
        field: "languageId",
      };
    }

    const language = subcategory.category.language;

    if (!language.isActive) {
      return {
        success: false,
        error: "The selected language is inactive.",
        field: "languageId",
      };
    }

    if (!SUPPORTED_LANGUAGES.has(language.code as SEOLanguage)) {
      return {
        success: false,
        error:
          "SEO generation currently supports English, Urdu, and Arabic only.",
        field: "languageId",
      };
    }

    const langCode = language.code as SEOLanguage;
    const catSlug = subcategory.category.slug;
    const subCatSlug = subcategory.slug;

    // 5. Generate language-specific SEO.
    // Article creation can continue even if SEO generation fails.
    const contentText = extractTextFromContent(data.content);
    let seo: SEOResult;

    try {
      seo = await generateSEO(
        data.title.trim(),
        contentText,
        langCode,
      );
    } catch (seoError) {
      console.error(
        "[createArticleAction] SEO generation failed; using fallback:",
        seoError,
      );

      // FIX: createFallbackSEO signature is (title, language, contentText).
      // The previous code passed (title, contentText, language), which
      // caused the TypeScript error and would have used the wrong language.
      seo = createFallbackSEO(
        data.title.trim(),
        langCode,
        contentText,
      );
    }

    const readingTime = estimateReadingTime(data.content);

    // 6. Build canonical URL
    const configuredBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const baseUrl = configuredBaseUrl.replace(/\/+$/, "");

    const canonicalUrl =
      `${baseUrl}/${langCode}/${catSlug}/${subCatSlug}/${data.slug}`;

    // 7. Prepare article status and dates
    const status = data.status || "DRAFT";
    const isPublished = status === "PUBLISHED";

    // 8. Create the article and SEO record
    const article = await prisma.blog.create({
      data: {
        title: data.title.trim(),
        slug: data.slug.trim(),

        shortDescription: seo.excerpt,

        content: data.content as unknown as Prisma.InputJsonValue,

        tableOfContents: (
          data.tableOfContents ?? []
        ) as unknown as Prisma.InputJsonValue,

        type: (data.type as any) || "ARTICLE",
        status: status as any,

        bannerImage: data.bannerImage.trim(),
        bannerImageAlt:
          data.bannerImageAlt?.trim() || data.title.trim(),

        featured: data.featured ?? false,

        publishedAt: isPublished ? new Date() : null,

        scheduledAt: data.scheduledAt
          ? new Date(data.scheduledAt)
          : null,

        // Relations
        authorId: user.id,
        languageId: data.languageId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,

        // Guest author
        writtenBy: data.writtenBy?.trim() || null,
        writerImageUrl: data.writerImageUrl?.trim() || null,

        readingTime,

        seo: {
          create: {
            metaTitle: seo.metaTitle,
            metaDescription: seo.metaDescription,
            canonicalUrl,

            noIndex: false,
            noFollow: false,

            // Use language-appropriate generated SEO metadata.
            ogTitle: seo.metaTitle,
            ogDescription: seo.metaDescription,
            ogImage: data.ogImage.trim(),

            twitterTitle: seo.metaTitle,
            twitterDescription: seo.metaDescription,
            twitterImage: data.ogImage.trim(),

            schemaType: "Article",
          },
        },
      },
    });

    // 9. Invalidate admin pages
    revalidatePath("/admin/articles");
    revalidatePath("/admin");

    // 10. Invalidate public pages and cached article lists
    if (isPublished) {
      revalidatePath("/");
      revalidatePath(
        `/${langCode}/${catSlug}/${subCatSlug}/${article.slug}`,
      );

      revalidateTag(CACHE_TAGS.home, "max");
      revalidateTag(CACHE_TAGS.homeScreen, "max");
      revalidateTag(
        CACHE_TAGS.categoryPageBlogs(catSlug),
        "max",
      );
      revalidateTag(
        CACHE_TAGS.subcategoryPageBlogs(subCatSlug),
        "max",
      );
      revalidateTag(CACHE_TAGS.blog(article.slug), "max");
    }

    return {
      success: true,
      data: {
        articleId: article.id,
        slug: article.slug,
        status: article.status,
      },
    };
  } catch (error) {
    console.error("[createArticleAction]", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "This slug is already in use. Please choose another one.",
        field: "slug",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create the article. Please try again.",
    };
  }
}
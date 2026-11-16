// src/actions/articles/get-continue-exploring.ts
"use server";

import { getSubcategoryBlogs } from "./get-subcategory-blogs";
import { getCategoryBlogs } from "./get-category-blogs";

// 👇 Import the exact types used by your other actions
import type { CategoryPageBlog } from "./get-category-blogs";
import type { SubcategoryPageBlog } from "./get-subcategory-blogs"; 

// Create a unified type for the array
// (If SubcategoryPageBlog and CategoryPageBlog are identical, you can just use CategoryPageBlog)
type UnifiedBlogType = CategoryPageBlog | SubcategoryPageBlog;

export async function getContinueExploringBlogs(
  currentArticleId: string,
  langCode: string,
  categorySlug: string,
  subcategorySlug: string
) {
  try {
    // 1. Fetch blogs from the same subcategory
    const subResult = await getSubcategoryBlogs(langCode, categorySlug, subcategorySlug, 1);
    
    // 👇 Explicitly type the array as an array of UnifiedBlogType
    let blogs: UnifiedBlogType[] = [];
    
    if (subResult.success) {
      // Filter out the current article
      blogs = subResult.blogs.filter((b) => b.id !== currentArticleId);
    }

    // 2. If we have less than 5, fetch from the broader category
    if (blogs.length < 5) {
      const catResult = await getCategoryBlogs(langCode, categorySlug, 1);
      
      if (catResult.success) {
        const existingIds = new Set(blogs.map((b) => b.id));
        existingIds.add(currentArticleId); // Don't include the current article

        const needed = 5 - blogs.length;
        const extraBlogs = catResult.blogs
          .filter((b) => !existingIds.has(b.id))
          .slice(0, needed);

        // TypeScript will now accept this because both are UnifiedBlogType
        blogs = [...blogs, ...extraBlogs];
      }
    }

    // Return exactly 5 (or fewer if the category doesn't have enough)
    return { success: true, blogs: blogs.slice(0, 5) };
  } catch (error) {
    console.error("[getContinueExploringBlogs]", error);
    return { success: false, error: "Failed to load related articles." };
  }
}
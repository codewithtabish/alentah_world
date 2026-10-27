// src/components/site/general/navbars/navbar.tsx

import { getLanguages } from "@/actions/language/get-languages";
import { NavbarClient } from "./navbar-client";
import { getCategories } from "@/actions/categories/get-categories";

export async function Navbar() {
  // Fetch real data from your database in parallel
  const [categoriesResult, languagesResult] = await Promise.all([
    getCategories(),
    getLanguages()
  ]);

  const categories = categoriesResult.success ? categoriesResult.categories : [];
  const languages = languagesResult.success ? languagesResult.languages : [];

  return (
    <NavbarClient 
      categories={categories} 
      languages={languages} 
    />
  );
}
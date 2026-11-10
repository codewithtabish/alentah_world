
import { getLanguages } from "@/actions/language/get-languages";
import ShareYourStoryForm from "@/components/site/pages/story/share-your-story-form";

export const metadata = {
  title: "Share Your Story | ENEENA",
  description:
    "Have a perspective, an experience or an idea worth sharing? Submit your original story to ENEENA's international editorial team.",
};

export default async function ShareYourStoryPage() {
  const result = await getLanguages();

  const languages =
    result.success
      ? result.languages.filter((language) => language.isActive)
      : [];

  return (
    <main className="w-full min-w-0">
      <ShareYourStoryForm
        languages={languages}
        languageError={
          result.success ? null : result.error
        }
      />
    </main>
  );
}

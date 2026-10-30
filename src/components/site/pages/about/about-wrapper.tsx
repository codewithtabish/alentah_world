import {
  AboutCta,
  AboutEditorNote,
  AboutHero,
  AboutLeadership,
  AboutMultilingual,
  AboutPhilosophy,
  AboutStory,
} from "./about-sections";
import { AboutCategoriesSection } from "./about-categories";

export function AboutWrapper() {
  return (
    <div className="flex flex-col">
      <AboutHero />
      <AboutStory />
      <AboutLeadership />
      <AboutEditorNote />
      <AboutPhilosophy />
      <AboutCategoriesSection />
      <AboutMultilingual />
      <AboutCta />
    </div>
  );
}
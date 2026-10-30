export const ABOUT_IMAGES = {
  cover: "/images/about/about_cover.webp",
  books: "/images/about/books.webp",
  editor: "/images/about/editor.webp",
  sudais: "/images/about/sudais.webp",
  sunsetMan: "/images/about/sunset_man.webp",
} as const;

/* ---------- Layout + colours (change here, updates everywhere) ---------- */

// Centered content width with side gutters, WITHOUT horizontal padding.
export const CONTAINER = "mx-auto w-[min(100%_-_2rem,76rem)]";

// Section bands from the design. Set to "" to remove backgrounds.
export const BAND_A = "bg-[#f4f0e8]";
export const BAND_B = "bg-[#faf8f4]";
export const BAND_CTA = "bg-[#6b0f1a]";

export const MAROON_TEXT = "text-[#7b1020]";
export const MAROON_BORDER = "border-[#7b1020]";
export const INK = "text-[#1f1b18]";
export const BODY = "text-[#5a544d]";
export const RULE = "border-[#ddd5c8]";

/* ------------------------------ Content ------------------------------ */

export const STORY_VALUES = [
  { title: "Depth over noise.", text: "We go beyond the surface to find what truly matters." },
  { title: "Context over superficial headlines.", text: "We look at the bigger picture." },
  { title: "Quality over quantity.", text: "We choose depth, not volume." },
  {
    title: "Curiosity without borders.",
    text: "We explore ideas, cultures and perspectives from around the world.",
  },
  {
    title: "Independent thinking and meaningful storytelling.",
    text: "We believe in journalism that informs, inspires and creates dialogue.",
  },
] as const;

export const LEADERS = [
  {
    name: "Talha Tabish",
    role: "Founder & Editor-in-Chief",
    image: ABOUT_IMAGES.editor,
    alt: "Portrait of Talha Tabish, Founder and Editor-in-Chief of Alentah World",
    bio: "Alentah World is built on a belief that journalism should encourage people to question, understand, and think independently. As Founder and Editor-in-Chief, Talha Tabish leads the publication's vision and overall editorial direction.",
  },
  {
    name: "Sudais Azlan",
    role: "Sub-Editor & AI Engineer",
    image: ABOUT_IMAGES.sudais,
    alt: "Portrait of Sudais Azlan, Sub-Editor and AI Engineer at Alentah World",
    bio: "Working alongside the Editor-in-Chief, the Sub-Editor contributes to the publication's editorial process, helping maintain clarity, consistency, and quality across published stories. As an AI engineer, Sudais also builds the intelligent tools behind Alentah's research, language and publishing workflows.",
  },
] as const;

export const PHILOSOPHY = [
  { title: "Depth Over Noise", text: "We value meaningful context and thoughtful exploration." },
  {
    title: "Curiosity Without Borders",
    text: "We welcome perspectives from different subjects, cultures, and places.",
  },
  {
    title: "Quality With Purpose",
    text: "Every story should have a reason to exist and something meaningful to offer.",
  },
  {
    title: "Independent Thinking",
    text: "We encourage readers to question, explore, and form their own understanding.",
  },
] as const;

export const LANGUAGES = [
  { label: "English", lang: "en", dir: "ltr" },
  { label: "اردو", lang: "ur", dir: "rtl" },
  { label: "العربية", lang: "ar", dir: "rtl" },
] as const;
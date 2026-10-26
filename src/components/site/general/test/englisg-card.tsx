import Link from "next/link";

export function EnglishArticleCard() {
  return (
    <div lang="en" dir="ltr" className="flex flex-col gap-2 border border-border p-5 rounded-2xl bg-card">
      <span className="text-xs font-bold uppercase tracking-widest text-primary">
        Technology
      </span>
      <Link href="/en/technology/ai-revolution" className="group">
        <h2 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
          How Artificial Intelligence Is Reshaping the Software Industry
        </h2>
      </Link>
      <p className="text-muted-foreground line-clamp-3">
        From autonomous coding agents to entirely new development workflows, artificial intelligence is changing how modern software is imagined, built, and delivered.
      </p>
      <span className="text-xs text-muted-foreground mt-2">
        By James Carter • Oct 21, 2025
      </span>
    </div>
  );
}
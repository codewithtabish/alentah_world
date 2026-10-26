import Link from "next/link";

export function UrduArticleCard() {
  return (
    <div lang="ur" dir="rtl" className="flex flex-col gap-2 border border-border p-5 rounded-2xl bg-card">
      <span className="text-xs font-bold uppercase tracking-widest text-primary">
        سیاست
      </span>
      <Link href="/ur/pakistan/politics-shift" className="group">
        <h2 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
          پاکستان کی سیاست میں اہم تبدیلیوں کا یا دور
        </h2>
      </Link>
      <p className="text-muted-foreground line-clamp-3">
        پارلیمنٹ میں ووٹ ڈالنے کے بعد حالیہ پیش رفت اور سیاسی منظر نامے میں اہم تبدیلیاں، جو ملکی سیاست کے مستقبل کا تعین کریں گی۔
      </p>
      <span className="text-xs text-muted-foreground mt-2">
        از عالمِ خان • ۲۰ اکتوبر ۲۰۲۵
      </span>
    </div>
  );
}
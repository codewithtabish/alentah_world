import Link from "next/link";

export function ArabicArticleCard() {
  return (
    <div lang="ar" dir="rtl" className="flex flex-col gap-2 border border-border p-5 rounded-2xl bg-card">
      <span className="text-xs font-bold uppercase tracking-widest text-primary">
        اقتصاد
      </span>
      <Link href="/ar/business/economic-shift" className="group">
        <h2 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
          تحولات اقتصادية تعيد تشكيل مستقبل المنطقة
        </h2>
      </Link>
      <p className="text-muted-foreground line-clamp-3">
        توسع القطاعات غير النفطية يعزز من جاذبية الأسواق الخليجية وفرص الاستثمار الجديدة، مما يعيد رسم ملامح الاقتصاد الإقليمي.
      </p>
      <span className="text-xs text-muted-foreground mt-2">
        بقلم سارة المصري • ١٩ أكتوبر ٢٠٢٥
      </span>
    </div>
  );
}
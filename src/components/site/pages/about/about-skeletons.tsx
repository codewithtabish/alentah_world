// src/app/(marketing)/about/page.tsx
import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutCategoriesWrapper } from "@/components/site/pages/about/about-categories-wrapper";

export const metadata = {
  title: "About Us | Alentah World",
  description: "An independent publication for curious minds, exploring the ideas, people, and perspectives shaping our world.",
};

export default function AboutPage() {
  const fontClass = "font-sans";
  const titleFont = "font-serif";

  return (
    <div className="flex flex-col pb-20" dir="ltr">
      
      {/* 1. HERO SECTION (Split Layout: Text Left, Image Right) */}
      <section className="w-full mb-16 bg-[#faf7f2] dark:bg-background">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-stretch">
          
          {/* LEFT: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 lg:px-12 lg:py-24">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">
              About Alentah World
            </span>
            <h1 className={cn("mb-6 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl leading-[1.1]", titleFont)}>
              A World of Stories.<br/>
              A Clearer Way of Seeing.
            </h1>
            <p className={cn("mb-8 text-lg text-muted-foreground leading-relaxed max-w-xl", fontClass)}>
              An independent publication for curious minds, exploring the ideas, people, and perspectives shaping our world through thoughtful journalism and meaningful storytelling.
            </p>
            <Link 
              href="#our-story" 
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4"
            >
              OUR STORY <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* RIGHT: Hero Image */}
          <div className="w-full lg:w-1/2 relative min-h-100 lg:min-h-full">
            <Image 
              src="/images/about/about_cover.webp" 
              alt="Alentah World About Cover" 
              fill 
              priority
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 space-y-24">
        
        {/* 2. OUR STORY */}
        <section id="our-story" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Story</span>
            <h2 className={cn("mb-6 text-3xl sm:text-4xl font-bold", titleFont)}>
              More Than Headlines.<br/>
              Stories That Matter.
            </h2>
            <p className={cn("text-muted-foreground leading-relaxed mb-6", fontClass)}>
              Alentah World believes great journalism should do more than deliver information. It should create understanding, encourage curiosity, and help readers see the world from different perspectives.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {[
              { title: "Depth over noise.", desc: "We go beyond the surface to find what truly matters." },
              { title: "Context over superficial headlines.", desc: "We look at the bigger picture." },
              { title: "Quality over quantity.", desc: "We choose depth, not volume." },
              { title: "Curiosity without borders.", desc: "We explore ideas, cultures and perspectives from around the world." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="h-0.5 w-6 mt-3 bg-primary shrink-0" />
                <div>
                  <h4 className={cn("text-sm font-bold text-foreground", fontClass)}>{item.title}</h4>
                  <p className={cn("text-sm text-muted-foreground", fontClass)}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-border/50">
              <Image src="/images/about/sunset_man.webp" alt="Reading by the river" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* 3. EDITORIAL LEADERSHIP */}
        <section>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">The People Behind Alentah</span>
          <h2 className={cn("mb-12 text-3xl sm:text-4xl font-bold", titleFont)}>Editorial Leadership</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Editor 1: Talha Tabish */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative w-full sm:w-48 aspect-4/5 shrink-0 overflow-hidden rounded-sm border border-border/50">
                <Image src="/images/about/editor.webp" alt="Talha Tabish" fill className="object-cover" />
              </div>
              <div>
                <h3 className={cn("text-xl font-bold mb-1", titleFont)}>Talha Tabish</h3>
                <p className={cn("text-xs font-bold text-primary mb-3", fontClass)}>Founder & Editor-in-Chief</p>
                {/* 👇 UPDATED BIO FOR TALHA */}
                <p className={cn("text-sm text-muted-foreground leading-relaxed", fontClass)}>
                  I’m a Senior Software Engineer and solo developer who independently designs, builds, launches, and manages digital products. I work across web applications, mobile apps, SaaS platforms, and startup ventures, turning ideas into complete, scalable products. From architecture and development to deployment, infrastructure, and ongoing management, I take ownership of the entire product lifecycle.
                </p>
              </div>
            </div>

            {/* Editor 2: Asad Ali */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative w-full sm:w-48 aspect-4/5 shrink-0 overflow-hidden rounded-sm border border-border/50">
                <Image src="/images/about/sudais.webp" alt="Asad Ali" fill className="object-cover" />
              </div>
              <div>
                <h3 className={cn("text-xl font-bold mb-1", titleFont)}>Asad Ali</h3>
                <p className={cn("text-xs font-bold text-primary mb-3", fontClass)}>AI Engineer & Sub-Editor</p>
                <p className={cn("text-sm text-muted-foreground leading-relaxed", fontClass)}>
                  Working alongside the Editor-in-Chief, Asad Ali contributes to the publication's editorial process, helping maintain clarity, consistency, and quality across published stories, while also engineering AI systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FROM THE EDITOR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 border-y border-border">
          <div className="lg:col-span-4">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm border border-border/50">
              <Image src="/images/about/editor.webp" alt="Talha Tabish" fill className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">From the Editor</span>
            <blockquote className={cn("text-2xl sm:text-3xl font-bold leading-snug mb-6", titleFont)}>
              “We don’t chase trends.<br/>
              We chase truth, taste, and time.”
            </blockquote>
            <p className={cn("text-muted-foreground leading-relaxed mb-8", fontClass)}>
              At Alentah, we believe that great stories do more than inform — they help us see the world more clearly. In a time of endless noise, we choose depth over speed, quality over quantity, and perspective over popularity.
            </p>
            <div>
              <p className="font-signature text-3xl text-foreground mb-2" style={{ fontFamily: 'cursive' }}>Talha Tabish</p>
              <p className={cn("text-xs font-bold text-muted-foreground uppercase", fontClass)}>Founder & Editor-in-Chief</p>
            </div>
          </div>
        </section>

        {/* 5. WHAT GUIDES US */}
        <section>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">Our Editorial Philosophy</span>
          <h2 className={cn("mb-10 text-3xl sm:text-4xl font-bold", titleFont)}>What Guides Us</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01.", title: "Depth Over Noise", desc: "We value meaningful context and thoughtful exploration." },
              { num: "02.", title: "Curiosity Without Borders", desc: "We welcome perspectives from different subjects, cultures, and places." },
              { num: "03.", title: "Quality With Purpose", desc: "Every story should have a reason to exist and something meaningful to offer." },
              { num: "04.", title: "Independent Thinking", desc: "We encourage readers to question, explore, and form their own understanding." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3">
                <span className="text-sm font-bold text-primary">{item.num}</span>
                <h3 className={cn("text-lg font-bold", titleFont)}>{item.title}</h3>
                <p className={cn("text-sm text-muted-foreground leading-relaxed", fontClass)}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. OUR EDITORIAL LANDSCAPE (Categories from DB) */}
        <section>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">What We Cover</span>
          <h2 className={cn("mb-10 text-3xl sm:text-4xl font-bold", titleFont)}>Our Editorial Landscape</h2>
          
          <Suspense fallback={<div className="h-48 flex items-center justify-center text-muted-foreground animate-pulse">Loading categories...</div>}>
            <AboutCategoriesWrapper />
          </Suspense>
        </section>

        {/* 7. THREE LANGUAGES */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-y border-border">
          <div className="relative aspect-video lg:aspect-auto w-full">
            <Image src="/images/about/books.webp" alt="Books" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-16">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-primary">A Multilingual Publication</span>
            <h2 className={cn("mb-6 text-3xl sm:text-4xl font-bold", titleFont)}>
              Three Languages.<br/>
              One Global Perspective.
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-bold text-primary font-serif">English</span>
              <span className="size-1 rounded-full bg-border" />
              <span className="text-lg font-bold text-primary font-urdu-display">اردو</span>
              <span className="size-1 rounded-full bg-border" />
              <span className="text-lg font-bold text-primary font-arabic-display">العربية</span>
            </div>
            <p className={cn("text-muted-foreground leading-relaxed", fontClass)}>
              Alentah publishes separate editorial content in English, Urdu, and Arabic — each with its own voice, perspective and reading experience.
            </p>
          </div>
        </section>
      </div>

      {/* 8. BOTTOM BANNER (Burgundy) */}
      <div className="w-full bg-primary text-primary-foreground mt-20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/70">Our Commitment to Readers</span>
            <h2 className={cn("text-3xl font-bold", titleFont)}>Your Curiosity Deserves Better Stories.</h2>
          </div>
          <div className="max-w-md text-sm text-primary-foreground/80 leading-relaxed">
            In a world that never stops publishing, we believe readers deserve more than another stream of headlines. They deserve thoughtful work, meaningful perspectives, and stories worth their time.
          </div>
          <Link href="/en" className="inline-flex h-12 items-center justify-center rounded-sm bg-background px-8 text-sm font-bold text-foreground hover:bg-background/90 transition-colors shrink-0">
            Explore Our Stories <ArrowRight className="size-4 ms-2" />
          </Link>
        </div>
      </div>

    </div>
  );
}
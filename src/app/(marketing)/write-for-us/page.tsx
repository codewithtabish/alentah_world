// src/app/(marketing)/write-for-us/page.tsx
import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, Gem, Users, Handshake, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { WritingCategories } from "@/components/site/pages/write/writing-categories";

export const metadata = {
  title: "Write for Us | Alentah World",
  description: "Share your perspective with readers around the world. Join our community of writers, thinkers, and storytellers.",
};

export default function WriteForUsPage() {
  const fontClass = "font-sans";
  const titleFont = "font-serif";

  return (
    <div className="flex flex-col pb-0 bg-[#faf7f2] dark:bg-background" dir="ltr">
      
      {/* 1. HERO SECTION */}
      <section className="w-full relative min-h-125 lg:min-h-150 flex items-center">
        <div className="absolute inset-0">
          <Image 
            src="/images/write/write_for_us_cover.webp" 
            alt="Writer at work" 
            fill 
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                Contribute to Alentah
              </span>
              <span className="h-px w-12 bg-white/50" />
            </div>
            
            <h1 className={cn("mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-[1.15]", titleFont)}>
              Your Voice Deserves<br/>a Wider Audience.
            </h1>
            
            <p className={cn("mb-8 text-lg text-white/90 leading-relaxed max-w-xl", fontClass)}>
              Have an idea worth sharing? Join our community of writers, thinkers, and storytellers. Share your perspective with readers around the world.
            </p>

            {/* 👇 SINGLE BUTTON LINKING TO CONTACT */}
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href="/contact" 
                className="inline-flex h-11 items-center justify-center rounded-sm bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Contact Us <ArrowRight className="size-4 ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY WRITE FOR ALENTAH */}
      <section className="w-full border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3">
              <h2 className={cn("text-2xl font-bold mb-3", titleFont)}>Why Write for Alentah?</h2>
              <p className={cn("text-sm text-muted-foreground leading-relaxed", fontClass)}>
                Join a respected global publication that values thoughtful ideas, diverse perspectives, and high-quality journalism.
              </p>
            </div>
            
            <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Globe, title: "Global Audience", desc: "Reach readers worldwide." },
                { icon: Gem, title: "Editorial Exposure", desc: "Showcase your expertise." },
                { icon: Users, title: "Share Your Expertise", desc: "Contribute to meaningful discourse." },
                { icon: Handshake, title: "Join a Creative Community", desc: "Be part of a worldwide network." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <item.icon className="size-7 text-primary" strokeWidth={1.5} />
                  <h3 className={cn("text-sm font-bold text-foreground", titleFont)}>{item.title}</h3>
                  <p className={cn("text-xs text-muted-foreground", fontClass)}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. WRITING CATEGORIES */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Suspense fallback={
            <div className="h-48 flex items-center justify-center text-muted-foreground animate-pulse">
              Loading categories...
            </div>
          }>
            <WritingCategories />
          </Suspense>
        </div>
      </section>

      {/* 4. CONTRIBUTOR GUIDELINES */}
      <section id="guidelines" className="w-full py-16 bg-[#6b1d2e]/5 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/3 relative aspect-video lg:aspect-square rounded-xl overflow-hidden border border-border/50">
            <Image src="/images/write/book.webp" alt="Books and Glasses" fill className="object-cover" />
          </div>
          
          <div className="w-full lg:w-2/3">
            <h2 className={cn("text-3xl font-bold mb-4", titleFont)}>Contributor Guidelines</h2>
            <p className={cn("text-sm text-muted-foreground mb-6", fontClass)}>
              To maintain our editorial standards, please keep the following in mind:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {[
                "Original and unpublished content.",
                "Well-researched articles.",
                "Clear and engaging writing.",
                "Proper references and citations.",
                "Relevant images with appropriate rights.",
                "Respectful and professional language.",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-primary shrink-0" strokeWidth={1.5} />
                  <span className={cn("text-sm text-foreground", fontClass)}>{rule}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20 p-4 text-amber-800 dark:text-amber-200">
              <Info className="size-5 shrink-0" />
              <p className={cn("text-xs font-medium", fontClass)}>
                Submissions are reviewed by our editorial team before publication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUBMISSION PROCESS */}
      <section id="submission-process" className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            
            <div className="w-full lg:w-1/4">
              <h2 className={cn("text-3xl font-bold mb-3", titleFont)}>Submission Process</h2>
              <p className={cn("text-xs sm:text-sm text-muted-foreground leading-relaxed", fontClass)}>
                It's simple. Just follow these steps.
              </p>
            </div>

            <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="hidden lg:block absolute top-6 left-8 right-8 h-px bg-border -z-10" />

              {[
                { num: "01", title: "Choose Your Topic", desc: "Find a subject you're passionate about." },
                { num: "02", title: "Prepare Your Article", desc: "Write a well-researched, original piece." },
                { num: "03", title: "Submit Your Work", desc: "Use the form below to send us your article." },
                { num: "04", title: "Editorial Review", desc: "Our team will review your submission." },
              ].map((step, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm mb-2">
                    {step.num}
                  </div>
                  <h3 className={cn("text-sm font-bold text-foreground", titleFont)}>{step.title}</h3>
                  <p className={cn("text-[11px] sm:text-xs text-muted-foreground leading-relaxed", fontClass)}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT / SUBMISSION AREA */}
      <section className="w-full py-16 bg-[#faf7f2] dark:bg-background border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          
          <h2 className={cn("text-4xl font-bold mb-4", titleFont)}>Let's Hear Your Story.</h2>
          <p className={cn("text-lg text-muted-foreground mb-8 leading-relaxed", fontClass)}>
            Share your ideas, insights, and expertise with the Alentah World community. We are always looking for fresh voices and unique perspectives.
          </p>

          <div className="bg-background rounded-2xl border border-border p-8 sm:p-12 shadow-sm mb-12">
            <h3 className={cn("text-2xl font-bold mb-4", titleFont)}>Ready to Submit?</h3>
            <p className={cn("text-sm text-muted-foreground mb-8", fontClass)}>
              Please email us your article pitch, draft, or any questions you might have. Make sure to include a short bio and relevant links to your previous work.
            </p>

            <a 
              href="mailto:submit@alentah.com" 
              className="inline-flex h-14 items-center justify-center rounded-sm bg-primary px-10 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Send an Email to submit@alentah.com <ArrowRight className="size-5 ms-3" />
            </a>

            <p className={cn("text-xs text-muted-foreground mt-6", fontClass)}>
              We aim to respond to all inquiries within 3-5 business days.
            </p>
          </div>

        </div>
      </section>

      {/* 7. FAQ */}
      <section className="w-full py-16 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className={cn("text-3xl font-bold mb-8 text-center", titleFont)}>Frequently Asked Questions</h2>
          
          <div className="flex flex-col gap-4">
            {[
              "Who can contribute to Alentah?",
              "What topics do you accept?",
              "Can I submit in different languages?",
              "How long does editorial review take?",
              "Can I submit previously published content?",
              "Do you accept AI-assisted articles?",
              "Who owns the copyright?",
            ].map((faq, i) => (
              <details key={i} className="group border border-border bg-background rounded-lg overflow-hidden">
                <summary className={cn("flex cursor-pointer items-center justify-between p-5 font-bold text-foreground hover:bg-muted/50 transition-colors", titleFont)}>
                  {faq}
                  <span className="transition-transform group-open:rotate-45 text-xl font-light text-muted-foreground">+</span>
                </summary>
                <div className={cn("p-5 pt-0 text-sm text-muted-foreground leading-relaxed", fontClass)}>
                  Answer for this question goes here. This is just a placeholder text to show how the accordion works and how the text will look when expanded.
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BOTTOM BANNER (Burgundy) */}
      <div className="w-full bg-[#6b1d2e] text-[#faf7f2] py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/world-map.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className={cn("text-3xl sm:text-4xl font-bold mb-2", titleFont)}>Every Great Publication Begins With a Voice.</h2>
            <p className={cn("text-lg text-white/80", fontClass)}>Make yours part of the Alentah story.</p>
          </div>
          <a href="mailto:submit@alentah.com" className="inline-flex h-12 items-center justify-center rounded-full bg-[#faf7f2] px-8 text-sm font-bold text-[#6b1d2e] hover:bg-white transition-colors shrink-0">
            Become a Contributor <ArrowRight className="size-4 ms-2" />
          </a>
        </div>
      </div>

    </div>
  );
}
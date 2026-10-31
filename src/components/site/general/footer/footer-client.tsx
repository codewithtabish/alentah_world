// src/components/site/general/footer/footer-client.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Mail, ArrowRight, ChevronRight, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryListItem } from "@/actions/categories/get-categories";
import { LanguageListItem } from "@/actions/language/get-languages";
import { FacebookIcon, InstagramIcon, LinkedinIcon, RssIcon, XIcon, YoutubeIcon } from "../theme/social-icons";

interface FooterClientProps {
  categories: CategoryListItem[];
  languages: LanguageListItem[];
}

export function FooterClient({ categories, languages }: FooterClientProps) {
  const fontClass = "font-sans";
  const titleFont = "font-serif";
  
  // Separate categories by language
  const englishCategories = categories.filter(
    (c) => c.language.code === "en" && c.isActive
  );
  const urduCategories = categories.filter(
    (c) => c.language.code === "ur" && c.isActive
  );

  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const socialLinks = [
    { icon: XIcon, href: "#" },
    { icon: FacebookIcon, href: "#" },
    { icon: InstagramIcon, href: "#" },
    { icon: LinkedinIcon, href: "#" },
    { icon: YoutubeIcon, href: "#" },
    { icon: RssIcon, href: "#" },
  ];

  const companyPages = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Advertise With Us", href: "/advertise" },
    { name: "Write for Us", href: "/write-for-us" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms and Conditions", href: "/terms" },
  ];

  return (
    <footer className="w-full border-t border-border bg-[#faf7f2] dark:bg-background pt-16 pb-8" dir="ltr">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* COLUMN 1: Brand & Social */}
          <div className="lg:col-span-3 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
            <Link 
              href="/en" 
              aria-label="Alentah World - Home"
              className="group block w-fit transition-opacity hover:opacity-80"
            >
              {/* SMALL DEVICES (< 640px): brand icon */}
              <span className="block sm:hidden">
                {/* Light mode icon (maroon) */}
                <Image
                  src="/images/logos/icon-maroon-1024.png"
                  alt="Alentah World"
                  width={1024}
                  height={1024}
                  sizes="80px"
                  className="block size-20 object-contain dark:hidden"
                />
                {/* Dark mode icon (white) */}
                <Image
                  src="/images/logos/icon-white-1024.png"
                  alt="Alentah World"
                  width={1024}
                  height={1024}
                  sizes="80px"
                  className="hidden size-20 object-contain dark:block"
                />
              </span>

              {/* LARGE DEVICES (>= 640px): full logo */}
              <span className="hidden w-65 sm:block">
                {/* Light mode logo (maroon) */}
                <Image
                  src="/images/logos/light.png"
                  alt="Alentah World"
                  width={3000}
                  height={1000}
                  sizes="260px"
                  className="block h-auto w-full object-contain dark:hidden"
                />
                {/* Dark mode logo (white) */}
                <Image
                  src="/images/logos/dark.png"
                  alt="Alentah World"
                  width={3000}
                  height={1000}
                  sizes="260px"
                  className="hidden h-auto w-full object-contain dark:block"
                />
              </span>
            </Link>

            <p className={cn("text-sm leading-relaxed text-muted-foreground max-w-xs", fontClass)}>
              Independent Journalism. Global Perspective.<br/>
              <em>A More Thoughtful Tomorrow.</em>
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              {socialLinks.map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href}
                  className="flex size-9 items-center justify-center rounded-full bg-foreground/5 text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Explore Categories (English + Urdu) */}
          <div className="lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className={cn("mb-6 text-lg font-bold text-foreground border-b-2 border-foreground/10 pb-2 inline-block", titleFont)}>
              Explore Categories
            </h3>
            <ul className="flex flex-col gap-3 w-full items-center md:items-start">
              
              {/* English Categories */}
              {englishCategories.slice(0, 3).map((cat) => (
                <li key={cat.id} className="w-full">
                  <Link 
                    href={`/en/${cat.slug}`}
                    className={cn("group flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors", fontClass)}
                  >
                    <span className="size-1.5 rounded-full bg-primary/40 group-hover:bg-primary hidden md:block" />
                    {cat.name}
                  </Link>
                </li>
              ))}

              {/* Divider */}
              <li className="h-px w-full bg-border/50 my-1" />

              {/* Urdu Categories (Centered, No dir="rtl") */}
              {urduCategories.slice(0, 3).map((cat) => (
                <li key={cat.id} className="w-full">
                  <Link 
                    href={`/ur/${cat.slug}`}
                    className="group flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-urdu-text"
                  >
                    <span className="size-1.5 rounded-full bg-primary/40 group-hover:bg-primary hidden md:block" />
                    {cat.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* COLUMN 3: Explore Subcategories (English + Urdu) */}
          <div className="lg:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className={cn("mb-6 text-lg font-bold text-foreground border-b-2 border-foreground/10 pb-2 inline-block", titleFont)}>
              Explore Subcategories
            </h3>
            <div className="flex flex-col gap-4 w-full items-center md:items-start">
               
               {/* English Subcategories */}
               {englishCategories.filter(c => c.subcategories.length > 0).slice(0, 1).map((cat) => (
                 <div key={cat.id} className="flex flex-col items-center md:items-start gap-2 w-full">
                    <p className={cn("text-sm font-bold text-foreground flex items-center gap-1.5", fontClass)}>
                      <ChevronRight className="size-3 text-muted-foreground hidden md:block" /> {cat.name}
                    </p>
                    <ul className="flex flex-col items-center md:items-start gap-2 w-full md:ms-4 md:border-s md:border-border/50 md:ps-3">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <li key={sub.id}>
                          <Link 
                            href={`/en/${cat.slug}/${sub.slug}`}
                            className={cn("text-[13px] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2", fontClass)}
                          >
                            <ChevronRight className="size-2.5 opacity-50 hidden md:block" /> {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                 </div>
               ))}

               {/* Urdu Subcategories (Centered, No dir="rtl") */}
               {urduCategories.filter(c => c.subcategories.length > 0).slice(0, 1).map((cat) => (
                 <div key={cat.id} className="flex flex-col items-center md:items-start gap-2 w-full">
                    <p className="text-sm font-bold text-foreground flex items-center gap-1.5 font-urdu-display">
                      <ChevronRight className="size-3 text-muted-foreground hidden md:block" /> {cat.name}
                    </p>
                    <ul className="flex flex-col items-center md:items-start gap-2 w-full md:ms-4 md:border-s md:border-border/50 md:ps-3">
                      {cat.subcategories.slice(0, 3).map((sub) => (
                        <li key={sub.id}>
                          <Link 
                            href={`/ur/${cat.slug}/${sub.slug}`}
                            className="text-[13px] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 font-urdu-text"
                          >
                            <ChevronRight className="size-2.5 opacity-50 hidden md:block" /> {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                 </div>
               ))}

            </div>
          </div>

          {/* COLUMN 4: Information Links & Newsletter */}
          <div className="lg:col-span-3 flex flex-col items-center md:items-start gap-8 text-center md:text-left">
            
            {/* INFORMATION LINKS */}
            <div className="w-full flex flex-col items-center">
              <h3 className={cn("mb-6 text-lg font-bold text-foreground border-b-2 border-foreground/10 pb-2 inline-block text-center", titleFont)}>
                Information
              </h3>
              <ul className="flex flex-col gap-3 w-full items-center">
                {companyPages.map((page) => (
                  <li key={page.name}>
                    <Link href={page.href} className={cn("text-sm text-muted-foreground hover:text-primary transition-colors block text-center", fontClass)}>
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* NEWSLETTER BOX */}
            <div className="w-full">
              <h3 className={cn("mb-3 text-lg font-bold text-foreground text-center md:text-left", titleFont)}>
                Stay Informed.
              </h3>
              <p className={cn("text-xs text-muted-foreground mb-3 text-center md:text-left", fontClass)}>
                Get the latest stories delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center max-w-sm mx-auto md:mx-0">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-12 text-sm outline-none focus:border-primary/50"
                  dir="ltr"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <button 
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {subscribed ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-6 mt-8">
          <p className="text-xs text-muted-foreground text-center md:text-start" dir="ltr">
            © 2026 Alentah World. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
             <Link href="/privacy" className={cn("text-xs text-muted-foreground hover:text-foreground", fontClass)}>Privacy Policy</Link>
             <Link href="/terms" className={cn("text-xs text-muted-foreground hover:text-foreground", fontClass)}>Terms and Conditions</Link>
             <Link href="/cookie" className={cn("text-xs text-muted-foreground hover:text-foreground", fontClass)}>Cookie Policy</Link>
             <Link href="/sitemap" className={cn("text-xs text-muted-foreground hover:text-foreground", fontClass)}>Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
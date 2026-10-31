// src/components/site/pages/terms/terms-content.tsx
// Server component: no state, no effects.
// Client parts: <PrivacyToc /> (table of contents) and <BackToTop />.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, FileText } from "lucide-react";
import { PrivacyToc } from "../privacy/privacy-toc";

/* ------------------------------------------------------------------ */
/* Owner-editable settings                                             */
/* ------------------------------------------------------------------ */

const LAST_UPDATED = "October 31, 2026";
const READING_TIME = "~12 min";
const CONTACT_HREF = "/contact";
const PRIVACY_HREF = "/privacy";

/** Leave empty until you have a real, monitored address. Nothing is invented. */
const CONTACT_EMAIL = "";

/**
 * The country or state whose law governs these Terms, for example
 * "the United Arab Emirates". Leave empty until you decide it with a lawyer;
 * the text then stays generic instead of naming a jurisdiction for you.
 */
const GOVERNING_JURISDICTION = "";

const IMAGES = {
  cover: "/images/privacy/privacy.webp",
} as const;

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

/* Keeps text clean even if a global style justifies or hyphenates <p> */
const cleanText = "text-start! hyphens-none! wrap-normal! break-normal! text-pretty";
const bodyText = `text-[15px] leading-[1.8] text-foreground/80 ${cleanText}`;
const inlineLink =
  "font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80";

function P({ children }: { children: React.ReactNode }) {
  return <p className={`mb-4 last:mb-0 ${bodyText}`}>{children}</p>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-4 flex flex-col gap-2.5 last:mb-0">
      {items.map((item, i) => (
        <li key={i} className={`relative ps-6 ${bodyText}`}>
          <span
            aria-hidden="true"
            className="absolute inset-s-1 top-[0.78em] size-1.5 rounded-full bg-primary"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={inlineLink}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Terms sections                                                      */
/* ------------------------------------------------------------------ */

type TermsSection = { id: string; title: string; body: React.ReactNode };

const SECTIONS: TermsSection[] = [
  /* 1 ------------------------------------------------------------- */
  {
    id: "acceptance-of-these-terms",
    title: "Acceptance of These Terms",
    body: (
      <>
        <P>
          These Terms govern your access to and use of Alentah World. By
          accessing or using our website, you agree to comply with these Terms
          and our applicable policies. If you do not agree, please discontinue
          use of our website and services.
        </P>
        <P>
          These Terms apply to every visitor, whether you read anonymously or
          have an account, and across all of our language editions.
        </P>
      </>
    ),
  },

  /* 2 ------------------------------------------------------------- */
  {
    id: "about-alentah-world",
    title: "About Alentah World",
    body: (
      <>
        <P>
          Alentah World is an independent multilingual digital publication,
          featuring journalism, analysis, and perspectives on a wide range of
          topics. Our content may be available in English, Urdu, and Arabic,
          with distinct editorial sections and content.
        </P>
        <P>
          Each language edition is its own publishing environment, not an
          automatic translation of another. Articles, categories, and editorial
          choices may therefore differ between editions.
        </P>
      </>
    ),
  },

  /* 3 ------------------------------------------------------------- */
  {
    id: "eligibility-and-age-requirements",
    title: "Eligibility and Age Requirements",
    body: (
      <>
        <P>
          Alentah World is open to anyone who can legally accept these Terms. By
          using our website, you confirm that you have the legal capacity to do
          so.
        </P>
        <P>
          If you are below the age at which you can enter a binding agreement or
          consent to the processing of your personal data in your country, you
          should use Alentah World only with the permission and supervision of a
          parent or legal guardian.
        </P>
      </>
    ),
  },

  /* 4 ------------------------------------------------------------- */
  {
    id: "website-access-and-availability",
    title: "Website Access and Availability",
    body: (
      <>
        <P>
          We strive to ensure a reliable and accessible experience. However,
          Alentah World may modify, suspend, or discontinue features at any
          time, and we do not guarantee uninterrupted availability of the
          website or its content.
        </P>
        <P>
          Access may be interrupted for maintenance, security, technical
          failures, or reasons outside our control. You are responsible for your
          own device, internet connection, and any costs they involve.
        </P>
      </>
    ),
  },

  /* 5 ------------------------------------------------------------- */
  {
    id: "user-accounts-and-google-sign-in",
    title: "User Accounts and Google Sign-In",
    body: (
      <>
        <P>
          You may create an account or access certain features using Google
          Sign-In, where available. Accounts are provided through our
          authentication provider, Clerk.
        </P>
        <UL
          items={[
            "You are responsible for maintaining the security of your account and for all activities that occur under it.",
            "The information you provide must be accurate, and you should keep it up to date.",
            "Please tell us promptly if you believe your account has been used without your permission.",
            "Use of Google Sign-In is also subject to Google’s own terms and policies.",
          ]}
        />
        <P>
          How we handle account information is explained in our{" "}
          <Link href={PRIVACY_HREF} className={inlineLink}>
            Privacy Policy
          </Link>
          .
        </P>
      </>
    ),
  },

  /* 6 ------------------------------------------------------------- */
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    body: (
      <>
        <P>You agree to use Alentah World lawfully and respectfully. In particular, you will:</P>
        <UL
          items={[
            "Follow all laws and regulations that apply to you",
            "Respect the rights, privacy, and dignity of other readers and contributors",
            "Use the site for personal reading and the features we offer",
            "Keep your sign-in details confidential",
          ]}
        />
      </>
    ),
  },

  /* 7 ------------------------------------------------------------- */
  {
    id: "prohibited-activities",
    title: "Prohibited Activities",
    body: (
      <>
        <P>You must not:</P>
        <UL
          items={[
            "Attempt to gain unauthorized access to the website, other accounts, or our systems",
            "Disrupt or overload the site, or introduce viruses or other harmful code",
            "Scrape, copy, or collect content or user information in bulk by automated means without our written permission",
            "Post spam, misleading content, or content that impersonates another person or organization",
            "Harass, threaten, defame, or discriminate against others",
            "Post unlawful, hateful, or sexually explicit content, or content that infringes someone else’s rights",
            "Interfere with advertising, for example through automated or fraudulent clicks",
            "Use Alentah World for any unlawful or deceptive purpose",
          ]}
        />
      </>
    ),
  },

  /* 8 ------------------------------------------------------------- */
  {
    id: "intellectual-property-and-copyright",
    title: "Intellectual Property and Copyright",
    body: (
      <>
        <P>
          The articles, images, design, logos, and other material on Alentah
          World belong to us or our licensors and are protected by copyright and
          other laws. The Alentah World name and logo may not be used without our
          written permission.
        </P>
        <P>
          You may read our content, share links to it, and quote short extracts
          with clear credit and a link back to the original article. Beyond
          that, you may not copy, republish, translate, sell, or otherwise
          exploit our content without our prior written permission.
        </P>
        <P>
          If you believe content on the site infringes your copyright, please
          tell us through our{" "}
          <Link href={CONTACT_HREF} className={inlineLink}>
            Contact page
          </Link>{" "}
          with the link to the content and details of your claim.
        </P>
      </>
    ),
  },

  /* 9 ------------------------------------------------------------- */
  {
    id: "editorial-content-and-accuracy",
    title: "Editorial Content and Accuracy",
    body: (
      <>
        <P>
          We aim for accurate, fair, and well-researched journalism. Articles
          reflect the views of their authors and are published for general
          information, not as professional, legal, financial, or medical advice.
        </P>
        <P>
          Despite our care, errors can occur and information can change. If you
          spot something that needs correcting, please let us know through the
          Contact page and we will review it.
        </P>
      </>
    ),
  },

  /* 10 ------------------------------------------------------------ */
  {
    id: "user-generated-content",
    title: "User-Generated Content",
    body: (
      <>
        <P>
          “User content” means anything you post or send to Alentah World,
          including comments and submissions. You remain responsible for what
          you post.
        </P>
        <P>
          You confirm that your content is lawful, that you have the right to
          share it, and that it does not infringe anyone’s rights. By posting it
          publicly, you give us a non-exclusive, worldwide, royalty-free licence
          to display and distribute it on Alentah World, and to remove or edit
          it where needed. We do not claim ownership of your content.
        </P>
        <P>
          We do not pre-screen all user content and are not responsible for
          opinions expressed by users, but we may remove content that breaches
          these Terms.
        </P>
      </>
    ),
  },

  /* 11 ------------------------------------------------------------ */
  {
    id: "article-submissions-and-publishing-rights",
    title: "Article Submissions and Publishing Rights",
    body: (
      <>
        <P>
          Where we accept stories, pitches, or articles, the following applies:
        </P>
        <UL
          items={[
            "Submitting does not guarantee publication, and we may decline any submission.",
            "You confirm the work is your own, original, and free of unlawful or infringing material.",
            "We may edit submissions for clarity, length, accuracy, style, and legal reasons.",
            "If we publish your work, you give us a licence to publish it on Alentah World with the author name and details you provide.",
            "Unless we agree otherwise in writing, contributions are unpaid.",
          ]}
        />
        <P>
          Published submissions and author details may become publicly visible.
          Please avoid including sensitive personal information unless it is
          necessary.
        </P>
      </>
    ),
  },

  /* 12 ------------------------------------------------------------ */
  {
    id: "comments-and-community-conduct",
    title: "Comments and Community Conduct",
    body: (
      <>
        <P>
          Discussion is welcome, but it must stay respectful. Comments must be
          relevant, lawful, and civil. We may remove comments, and restrict the
          accounts behind them, if they contain abuse, hate speech, spam,
          personal attacks, or anything prohibited by these Terms.
        </P>
        <P>
          Comments are public and may be associated with your account name.
          Please think before sharing personal details.
        </P>
      </>
    ),
  },

  /* 13 ------------------------------------------------------------ */
  {
    id: "bookmarks-likes-and-other-features",
    title: "Bookmarks, Likes, and Other Features",
    body: (
      <>
        <P>
          Where available, signed-in readers may like or bookmark articles and
          use other features we provide. These features are offered as a
          convenience and may change, be limited, or be removed at any time.
        </P>
        <P>
          Please use them in good faith. Automated or abusive use of these
          features is not permitted.
        </P>
      </>
    ),
  },

  /* 14 ------------------------------------------------------------ */
  {
    id: "browser-push-notifications",
    title: "Browser Push Notifications",
    body: (
      <>
        <P>
          Where browser notifications are offered, they are optional. Your
          browser asks for your permission, and we only send notifications to
          people who have allowed them.
        </P>
        <P>
          You can turn notifications off at any time in your browser or device
          settings. We may change or stop the notification service at any time.
          See our{" "}
          <Link href={PRIVACY_HREF} className={inlineLink}>
            Privacy Policy
          </Link>{" "}
          for how subscription information is handled.
        </P>
      </>
    ),
  },

  /* 15 ------------------------------------------------------------ */
  {
    id: "advertising-and-sponsored-content",
    title: "Advertising and Sponsored Content",
    body: (
      <>
        <P>
          Alentah World may display advertisements and publish sponsored content
          or commercial partnerships. Sponsored content is intended to be
          clearly identified, and advertising does not control our editorial
          decisions.
        </P>
        <P>
          Advertisements are provided by third parties. We are not responsible
          for their content, and their appearance is not an endorsement of any
          product or service. Dealings with advertisers are solely between you
          and them. Advertising technologies are described in our{" "}
          <Link href={PRIVACY_HREF} className={inlineLink}>
            Privacy Policy
          </Link>
          .
        </P>
      </>
    ),
  },

  /* 16 ------------------------------------------------------------ */
  {
    id: "third-party-websites-and-services",
    title: "Third-Party Websites and Services",
    body: (
      <>
        <P>
          Our pages may link to external websites, and we rely on third-party
          services such as Clerk and Google for sign-in and Vercel for hosting.
          We do not control these third parties and are not responsible for
          their content, availability, or practices.
        </P>
        <P>
          Your use of third-party sites and services is governed by their own
          terms and privacy policies.
        </P>
      </>
    ),
  },

  /* 17 ------------------------------------------------------------ */
  {
    id: "privacy-and-personal-information",
    title: "Privacy and Personal Information",
    body: (
      <>
        <P>
          Your privacy matters to us. How we collect, use, and protect personal
          information is explained in our{" "}
          <Link href={PRIVACY_HREF} className={inlineLink}>
            Privacy Policy
          </Link>
          , which forms part of these Terms.
        </P>
      </>
    ),
  },

  /* 18 ------------------------------------------------------------ */
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <>
        <P>
          Alentah World and its content are provided “as is” and “as available”.
          To the fullest extent permitted by law, we make no warranties of any
          kind, express or implied, including about accuracy, completeness,
          reliability, availability, or fitness for a particular purpose.
        </P>
        <P>
          We do not guarantee that the website will be free of errors, viruses,
          or interruptions. Nothing here affects rights you have under
          mandatory consumer laws that cannot be excluded.
        </P>
      </>
    ),
  },

  /* 19 ------------------------------------------------------------ */
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    body: (
      <>
        <P>
          To the fullest extent permitted by law, Alentah World and the people
          who run it will not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or for any loss of data, profits,
          or reputation, arising from your use of, or inability to use, the
          website or its content.
        </P>
        <P>
          Nothing in these Terms excludes or limits liability that cannot be
          excluded or limited under applicable law.
        </P>
      </>
    ),
  },

  /* 20 ------------------------------------------------------------ */
  {
    id: "indemnification",
    title: "Indemnification",
    body: (
      <>
        <P>
          You agree to indemnify and hold harmless Alentah World and the people
          who run it from claims, losses, and expenses, including reasonable
          legal fees, arising from content you post, your breach of these
          Terms, or your violation of any law or third-party right.
        </P>
      </>
    ),
  },

  /* 21 ------------------------------------------------------------ */
  {
    id: "suspension-and-termination",
    title: "Suspension and Termination",
    body: (
      <>
        <P>
          We may suspend or terminate your access or account, and remove your
          content, if you breach these Terms, create risk or legal exposure for
          us or others, or misuse the website.
        </P>
        <P>
          You may stop using Alentah World at any time, and you can ask us to
          delete your account through the Contact page. Sections that by their
          nature should continue, such as intellectual property, disclaimers,
          and limitation of liability, will remain in effect after termination.
        </P>
      </>
    ),
  },

  /* 22 ------------------------------------------------------------ */
  {
    id: "changes-to-the-website-and-services",
    title: "Changes to the Website and Services",
    body: (
      <>
        <P>
          Alentah World is continually evolving. We may add, change, or remove
          content, features, editions, and services at any time, with or
          without notice, and we are not liable to you for doing so.
        </P>
      </>
    ),
  },

  /* 23 ------------------------------------------------------------ */
  {
    id: "changes-to-these-terms",
    title: "Changes to These Terms",
    body: (
      <>
        <P>
          We may update these Terms from time to time. When we do, we will
          change the “Last Updated” date at the top of this page. Your continued
          use of Alentah World after an update means you accept the revised
          Terms, so please review this page periodically.
        </P>
      </>
    ),
  },

  /* 24 ------------------------------------------------------------ */
  {
    id: "governing-law-and-dispute-resolution",
    title: "Governing Law and Dispute Resolution",
    body: (
      <>
        <P>
          {GOVERNING_JURISDICTION
            ? `These Terms are governed by the laws of ${GOVERNING_JURISDICTION}, without regard to conflict-of-law rules.`
            : "These Terms are governed by the laws that apply to the operator of Alentah World, without regard to conflict-of-law rules."}{" "}
          Nothing in this section limits any mandatory consumer rights you have
          in your own country.
        </P>
        <P>
          If you have a concern or dispute, please contact us first through the
          Contact page so we can try to resolve it informally. If it cannot be
          resolved that way, it will be handled by the competent courts
          {GOVERNING_JURISDICTION ? ` of ${GOVERNING_JURISDICTION}` : ""},
          unless applicable law says otherwise.
        </P>
      </>
    ),
  },
];

/* Section 25 (Contact Information) is rendered separately, with its CTA */
const CONTACT_SECTION = { id: "contact-information", title: "Contact Information" } as const;

const TOC_ITEMS = [
  ...SECTIONS.map(({ id, title }) => ({ id, title })),
  CONTACT_SECTION,
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function SectionShell({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 border-b border-border pb-10 last:border-b-0 last:pb-0"
    >
      <h2
        id={`${id}-title`}
        className="mb-5 flex items-baseline gap-3 font-serif text-3xl font-bold leading-tight tracking-tight text-primary sm:text-[2.1rem]"
      >
        <span aria-hidden="true" className="tabular-nums">
          {index}.
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function TermsContent() {
  return (
    <div className="flex min-w-0 flex-col gap-12 overflow-x-clip pb-16 lg:gap-16 lg:pb-24">
      {/* ============================================================ */}
      {/* 1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="relative isolate overflow-hidden border-b-2 border-primary">
        {/* Image: fades into the page on the left (desktop) */}
        <div className="absolute inset-y-0 inset-e-0 -z-10 w-full lg:w-[62%] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_20%,black_50%)] lg:mask-[linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_20%,black_50%)]">
          <Image
            src={IMAGES.cover}
            alt="Golden scales of justice resting on law books in front of a burgundy arch and a marble column"
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-right"
          />
        </div>

        {/* Readability wash on small screens */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-background/80 lg:hidden"
        />

        <div className="flex min-h-96 max-w-2xl flex-col justify-center py-12 lg:min-h-112 lg:py-16">
          <span className="mb-5 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Terms &amp; Conditions
            <span aria-hidden="true" className="hidden h-px w-24 bg-primary/60 sm:block" />
          </span>

          <h1 className="mb-6 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl xl:text-[3.5rem]">
            Clear Principles. Better Conversations. Responsible Publishing.
          </h1>

          <p className={`mb-3 max-w-md text-base leading-relaxed text-foreground/80 ${cleanText}`}>
            Welcome to Alentah World. These Terms of Service explain the
            conditions governing your access to and use of our publication,
            website, and available services.
          </p>
          <p className={`mb-8 max-w-md text-base leading-relaxed text-foreground/80 ${cleanText}`}>
            By accessing or using Alentah World, you agree to comply with these
            Terms and our applicable policies.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-foreground/75">
            <li className="flex items-center gap-2">
              <FileText className="size-4 text-primary" aria-hidden="true" />
              Document: Terms of Service
            </li>
            <li aria-hidden="true" className="hidden h-5 w-px bg-foreground/20 sm:block" />
            <li className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              Last Updated: {LAST_UPDATED}
            </li>
            <li aria-hidden="true" className="hidden h-5 w-px bg-foreground/20 sm:block" />
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              Reading Time: {READING_TIME}
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TOC + TERMS                                               */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-4 xl:col-span-3">
          <PrivacyToc
            items={TOC_ITEMS}
            noteTitle="Our Commitment"
            noteText="A transparent and trustworthy publishing experience for our readers."
          />
        </aside>

        <article className="min-w-0 lg:col-span-8 xl:col-span-9">
          <div className="flex max-w-184 flex-col gap-10">
            {SECTIONS.map((section, i) => (
              <SectionShell
                key={section.id}
                id={section.id}
                index={i + 1}
                title={section.title}
              >
                {section.body}
              </SectionShell>
            ))}

            {/* 25. Contact */}
            <SectionShell
              id={CONTACT_SECTION.id}
              index={SECTIONS.length + 1}
              title={CONTACT_SECTION.title}
            >
              <div className="rounded-lg border border-border bg-primary/5 p-6 sm:p-8">
                <h3 className="mb-3 font-serif text-2xl font-bold leading-tight text-primary">
                  Questions About These Terms?
                </h3>
                <p className={`mb-6 max-w-xl text-[15px] leading-[1.8] text-foreground/80 ${cleanText}`}>
                  If you have questions about these Terms of Service, need to
                  report a problem, or want to raise a concern, please contact
                  Alentah World through its official contact channel.
                </p>

                {CONTACT_EMAIL && (
                  <p className={`mb-6 text-[15px] text-foreground/80 ${cleanText}`}>
                    Email:{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className={inlineLink}>
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                )}

                <Link
                  href={CONTACT_HREF}
                  className="group/btn inline-flex h-12 items-center gap-2.5 rounded-[3px] bg-primary px-6 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors duration-300 hover:bg-primary/90"
                >
                  Contact Alentah World
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </SectionShell>
          </div>
        </article>
      </div>

      {/* <BackToTop /> */}
    </div>
  );
}
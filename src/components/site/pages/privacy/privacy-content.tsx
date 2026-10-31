// src/components/site/pages/privacy/privacy-content.tsx
// Server component: no state, no effects. Only <PrivacyToc /> is client-side.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, FileText } from "lucide-react";
import { PrivacyToc } from "@/components/site/pages/privacy/privacy-toc";

/* ------------------------------------------------------------------ */
/* Owner-editable settings                                             */
/* ------------------------------------------------------------------ */

const LAST_UPDATED = "October 31, 2026";
const READING_TIME = "~10 min";
const CONTACT_HREF = "/contact";

/**
 * Leave empty until you have a real, monitored privacy address.
 * When set, it is shown in the Contact section. Nothing is invented.
 */
const PRIVACY_EMAIL = "";

const IMAGES = {
  cover: "/images/privacy/privacy.webp",
} as const;

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

/* Keeps text clean even if a global style justifies or hyphenates <p> */
const cleanText = "text-start! hyphens-none! wrap-normal! break-normal! text-pretty";
const bodyText = `text-[15px] leading-[1.8] text-foreground/80 ${cleanText}`;

function P({ children }: { children: React.ReactNode }) {
  return <p className={`mb-4 last:mb-0 ${bodyText}`}>{children}</p>;
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 mt-7 font-serif text-lg font-bold leading-snug text-primary">
      {children}
    </h3>
  );
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  );
}

function ProviderList({
  items,
}: {
  items: { name: string; href: string; role: React.ReactNode }[];
}) {
  return (
    <dl className="mb-4 flex flex-col border-t border-border last:mb-0">
      {items.map((item) => (
        <div
          key={item.name}
          className="grid grid-cols-1 gap-1 border-b border-border py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
        >
          <dt className="font-serif text-base font-bold text-primary">
            <Ext href={item.href}>{item.name}</Ext>
          </dt>
          <dd className={bodyText}>{item.role}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Policy sections                                                     */
/* ------------------------------------------------------------------ */

type PolicySection = { id: string; title: string; body: React.ReactNode };

const SECTIONS: PolicySection[] = [
  /* 1 ------------------------------------------------------------- */
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <>
        <P>
          Welcome to <em>Alentah World</em>. This Privacy Policy explains how we
          collect, use, store, and protect your personal information when you
          visit our website, read our content, or interact with our services.
        </P>
        <P>
          Alentah World is an independent, multilingual digital publication
          available at alentah.com in English, Urdu, and Arabic. This policy
          applies to all of our language editions and to every visitor, whether
          you read anonymously or have an account.
        </P>
        <P>
          We are committed to transparency and to ensuring that you can make
          informed choices about your data. If something in this policy is
          unclear, please contact us and we will do our best to explain it.
        </P>
      </>
    ),
  },

  /* 2 ------------------------------------------------------------- */
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <P>
          You can read Alentah World without creating an account. The
          information we collect depends on how you use the site.
        </P>

        <H3>Information you provide directly</H3>
        <UL
          items={[
            "Newsletter: your email address, if you subscribe.",
            "Account: your name, email address, and profile image, when you create an account or sign in (including with Google).",
            "Contact forms: your name, email address, subject, enquiry type, and the message you write.",
            "Comments and submissions: the content you post or send to our editorial team, together with any details you choose to include.",
          ]}
        />

        <H3>Information collected automatically</H3>
        <P>
          When you visit the site, certain technical information is processed by
          our servers, our hosting provider, and the services we use. This may
          include:
        </P>
        <UL
          items={[
            "IP address and approximate location inferred from it",
            "Browser type, device type, and operating system",
            "Pages visited, request times, and referring pages",
            "Technical, diagnostic, and security logs",
          ]}
        />

        <H3>Browser notifications</H3>
        <P>
          If you choose to allow browser notifications, your browser gives us a
          push subscription (an endpoint and encryption keys) so we can deliver
          notifications. See section 8 for details.
        </P>
      </>
    ),
  },

  /* 3 ------------------------------------------------------------- */
  {
    id: "how-we-use-your-information",
    title: "How We Use Your Information",
    body: (
      <>
        <P>We use the information we collect to:</P>
        <UL
          items={[
            "Provide, operate, and improve our content and services",
            "Create and manage accounts and keep sessions secure",
            "Respond to your enquiries and editorial submissions",
            "Send newsletters or notifications you have chosen to receive",
            "Understand how the site is used so we can improve the reading experience",
            "Display advertising and measure its performance, where advertising is enabled",
            "Protect the site against spam, abuse, and security threats",
            "Meet our legal obligations",
          ]}
        />
        <P>
          Information received through Google Sign-In is used only to
          authenticate you and operate your account. It is not used for
          advertising or ad personalization.
        </P>
      </>
    ),
  },

  /* 4 ------------------------------------------------------------- */
  {
    id: "cookies-and-similar-technologies",
    title: "Cookies and Similar Technologies",
    body: (
      <>
        <P>
          Cookies are small files stored on your device. We also use similar
          technologies such as local storage. They fall into these categories:
        </P>
        <UL
          items={[
            <>
              <strong className="font-semibold text-foreground">
                Strictly necessary:
              </strong>{" "}
              authentication and session cookies set by our sign-in provider so
              you can stay signed in and keep your account secure.
            </>,
            <>
              <strong className="font-semibold text-foreground">
                Preferences:
              </strong>{" "}
              settings such as your chosen theme (light or dark) and language
              edition.
            </>,
            <>
              <strong className="font-semibold text-foreground">
                Analytics:
              </strong>{" "}
              optional technologies that help us understand how pages are used
              (see section 5).
            </>,
            <>
              <strong className="font-semibold text-foreground">
                Advertising:
              </strong>{" "}
              technologies set by advertising providers, where advertising is
              enabled (see section 6).
            </>,
          ]}
        />
        <P>
          You can block or delete cookies in your browser settings. If you do,
          some features, such as staying signed in, may stop working. Where the
          law requires your consent for optional cookies, we will ask for it
          before they are used.
        </P>
      </>
    ),
  },

  /* 5 ------------------------------------------------------------- */
  {
    id: "analytics-and-website-performance",
    title: "Analytics and Website Performance",
    body: (
      <>
        <P>
          We may use analytics and performance-monitoring tools to understand
          which articles are read, how quickly pages load, and where technical
          problems occur. These tools may process information such as your IP
          address, device and browser details, and the pages you view.
        </P>
        <P>
          We use this information in aggregate to improve the publication, not
          to identify individual readers. As the site owner we may also use
          search-performance tools, such as Google Search Console, to see how
          our pages appear in search results.
        </P>
      </>
    ),
  },

  /* 6 ------------------------------------------------------------- */
  {
    id: "advertising-and-sponsored-content",
    title: "Advertising and Sponsored Content",
    body: (
      <>
        <P>
          Alentah World may display advertisements and publish sponsored content
          or commercial partnerships to help fund independent journalism.
        </P>

        <H3>Advertising providers</H3>
        <P>
          Where advertising is enabled, third-party advertising providers may
          use cookies and similar technologies to show ads, limit how often you
          see them, and measure their performance. These providers may collect
          information such as your IP address, browser details, and the pages
          you view. Their handling of this information is governed by their own
          privacy policies.
        </P>
        <P>
          Depending on your location, you can manage personalized advertising
          through{" "}
          <Ext href="https://adssettings.google.com">Google Ad Settings</Ext>,{" "}
          <Ext href="https://www.youradchoices.com">YourAdChoices</Ext>, or{" "}
          <Ext href="https://www.youronlinechoices.com">Your Online Choices</Ext>
          .
        </P>

        <H3>Editorial independence</H3>
        <P>
          Advertising and sponsorship are separate from our editorial work.
          Sponsored content is intended to be clearly identified, and advertisers
          do not control our reporting. We do not give advertisers your name,
          email address, or account details.
        </P>
        <P>
          Google Sign-In and account data are never used for advertising
          purposes.
        </P>
      </>
    ),
  },

  /* 7 ------------------------------------------------------------- */
  {
    id: "third-party-services",
    title: "Third-Party Services",
    body: (
      <>
        <P>
          We rely on trusted service providers to run Alentah World. Each
          processes information only to provide its service to us.
        </P>
        <ProviderList
          items={[
            {
              name: "Clerk",
              href: "https://clerk.com/legal/privacy",
              role: "Authentication: account registration, sign-in, session management, and account security.",
            },
            {
              name: "Google",
              href: "https://policies.google.com/privacy",
              role: "Optional Google Sign-In, which lets you sign in with your Google account.",
            },
            {
              name: "Vercel",
              href: "https://vercel.com/legal/privacy-policy",
              role: "Website hosting and deployment, including technical request logs.",
            },
            {
              name: "Amazon Web Services",
              href: "https://aws.amazon.com/privacy/",
              role: "Hosting for our PostgreSQL database, where used, which stores account and site data.",
            },
            {
              name: "Advertising providers",
              href: "https://policies.google.com/technologies/ads",
              role: "Display advertising and measurement, where advertising is enabled. The link above explains Google's advertising technologies.",
            },
          ]}
        />
        <P>
          We may also use an email delivery service to send newsletters and
          account messages. We only share the information these providers need
          to perform their service.
        </P>
      </>
    ),
  },

  /* 8 ------------------------------------------------------------- */
  {
    id: "newsletter-and-email-communications",
    title: "Newsletter and Email Communications",
    body: (
      <>
        <P>
          If you subscribe to our newsletter, we collect your email address and
          use it to send you articles, updates, and news from Alentah World.
          Subscribing is voluntary.
        </P>
        <P>
          You can unsubscribe at any time by using the unsubscribe option in our
          emails, where provided, or by contacting us. Newsletters are separate
          from necessary account or security messages, which we may still send
          if you have an account.
        </P>

        <H3>Browser notifications</H3>
        <P>
          Where browser notifications are available, your browser asks for your
          permission before anything is sent. We do not send notifications to
          visitors who have not allowed them.
        </P>
        <UL
          items={[
            "If you subscribe, we store your push subscription (an endpoint and encryption keys) so we can deliver notifications. It may be linked to your account if you are signed in, or stored without an account if you are not.",
            "Notifications may include an article title, description, image, and link.",
            "You can turn notifications off at any time in your browser or device settings.",
          ]}
        />
      </>
    ),
  },

  /* 9 ------------------------------------------------------------- */
  {
    id: "user-accounts-and-authentication",
    title: "User Accounts and Authentication",
    body: (
      <>
        <P>
          Accounts are managed through{" "}
          <Ext href="https://clerk.com/legal/privacy">Clerk</Ext>, our
          authentication provider. You can sign up with your email or choose to
          sign in with your Google account, which avoids creating a separate
          password.
        </P>

        <H3>Google Sign-In</H3>
        <P>
          Google Sign-In is used for identity authentication only. It uses the
          standard Google identity scopes (openid, email, and profile), and may
          provide:
        </P>
        <UL
          items={[
            "A unique Google account identifier",
            "Your name and email address, and whether the email is verified",
            "Your profile picture, if you have one",
          ]}
        />
        <P>
          This is used to create or link your Alentah World account, identify
          you when you sign in, keep your session secure, and display your name
          or profile image where the site supports it. We do not request access
          to your Gmail, Google Drive, Contacts, Calendar, YouTube, or other
          Google services.
        </P>
        <P>
          Our use of information received from Google follows the{" "}
          <Ext href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </Ext>
          , including its Limited Use requirements. We do not sell Google user
          data, use it for advertising, or use it for unrelated purposes.
        </P>

        <H3>Where account data is stored</H3>
        <P>
          Authentication data is processed by Clerk. We also keep a record in
          our own database, which may include an internal user ID, your Clerk
          user ID, name, email address, profile image, and account creation
          date. To request deletion of your account, contact us (see section
          14). Some records may be retained where needed for security or legal
          reasons.
        </P>
      </>
    ),
  },

  /* 10 ------------------------------------------------------------ */
  {
    id: "comments-and-user-submissions",
    title: "Comments and User Submissions",
    body: (
      <>
        <P>
          Where these features are available, readers may leave comments, like
          or bookmark articles, and send stories or corrections to our editorial
          team. It helps to know which of three categories your information
          falls into:
        </P>
        <UL
          items={[
            <>
              <strong className="font-semibold text-foreground">Private:</strong>{" "}
              messages sent to us through the contact form are used to respond
              to you and are not published.
            </>,
            <>
              <strong className="font-semibold text-foreground">
                Editorial review:
              </strong>{" "}
              stories and pitches are read by our editorial team to decide
              whether to publish. Submitting does not guarantee publication.
            </>,
            <>
              <strong className="font-semibold text-foreground">Public:</strong>{" "}
              comments, and any article we publish, are visible to everyone,
              including the author name and biography you provide.
            </>,
          ]}
        />
        <P>
          Please do not include sensitive personal information in public
          comments or published submissions unless it is necessary. Comments are
          associated with the account that posted them. Likes and bookmarks are
          linked to your account, and you can ask us to remove content you have
          posted.
        </P>
      </>
    ),
  },

  /* 11 ------------------------------------------------------------ */
  {
    id: "data-sharing-and-disclosure",
    title: "Data Sharing and Disclosure",
    body: (
      <>
        <P>We do not sell your personal information. We may share it:</P>
        <UL
          items={[
            "With service providers that help us run the site, as described in section 7",
            "When you choose to make information public, such as a comment",
            "When required by law, legal process, or a valid request from public authorities",
            "To protect the rights, safety, and security of our readers, our team, or the site",
            "In connection with a merger, acquisition, or transfer of the publication, with continued protection of your information",
          ]}
        />
      </>
    ),
  },

  /* 12 ------------------------------------------------------------ */
  {
    id: "data-retention",
    title: "Data Retention",
    body: (
      <>
        <P>
          We keep personal information only for as long as it is needed for the
          purposes described in this policy.
        </P>
        <UL
          items={[
            "Account information is kept while your account is active, until it is deleted.",
            "Newsletter email addresses are kept until you unsubscribe or ask us to remove them.",
            "Contact enquiries and editorial submissions are kept as long as needed to respond and manage our records.",
            "Push subscriptions are kept until you unsubscribe or the subscription is no longer valid.",
            "Comments remain visible until they are removed.",
          ]}
        />
        <P>
          Some information may be kept longer for security, legal,
          dispute-resolution, or legitimate operational reasons. Data may also
          remain in backups or with third-party providers for a limited time
          after deletion.
        </P>
      </>
    ),
  },

  /* 13 ------------------------------------------------------------ */
  {
    id: "data-security",
    title: "Data Security",
    body: (
      <>
        <P>
          We take reasonable steps to protect your information, including
          HTTPS encryption in transit, a dedicated authentication provider,
          server-side validation of submitted forms, access controls on our
          systems, and spam and abuse protection on forms.
        </P>
        <P>
          However, no method of transmission over the internet or electronic
          storage is completely secure, so we cannot guarantee absolute
          security. Please use a strong, unique password if you sign up with
          email.
        </P>
      </>
    ),
  },

  /* 14 ------------------------------------------------------------ */
  {
    id: "your-privacy-rights",
    title: "Your Privacy Rights",
    body: (
      <>
        <P>
          Depending on where you live and the laws that apply, you may have the
          right to:
        </P>
        <UL
          items={[
            "Access the personal information we hold about you",
            "Correct inaccurate information",
            "Request deletion of your information",
            "Withdraw consent you previously gave",
            "Restrict or object to certain processing",
            "Receive a portable copy of your information",
            "Unsubscribe from our newsletter at any time",
          ]}
        />
        <P>
          To make a request, please use our{" "}
          <Link
            href={CONTACT_HREF}
            className="font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Contact page
          </Link>
          . We may need to verify your identity first, and we may decline
          requests where the law allows or requires us to. If you are in a
          region with a data protection authority, you may also contact that
          authority with a complaint.
        </P>
      </>
    ),
  },

  /* 15 ------------------------------------------------------------ */
  {
    id: "international-data-transfers",
    title: "International Data Transfers",
    body: (
      <>
        <P>
          Alentah World serves readers around the world, and the providers we
          use may process information in countries other than your own,
          including countries whose data protection laws differ from yours.
        </P>
        <P>
          By using the site, you understand that your information may be
          processed in these locations. We choose established providers and
          rely on the safeguards they offer, which are described in their own
          privacy documentation linked in section 7.
        </P>
      </>
    ),
  },

  /* 16 ------------------------------------------------------------ */
  {
    id: "childrens-privacy",
    title: "Children’s Privacy",
    body: (
      <>
        <P>
          Alentah World is a general-audience publication and is not directed
          at children. We do not knowingly collect personal information from
          children without any required parental consent.
        </P>
        <P>
          If you are a parent or guardian and believe a child has given us
          personal information, please contact us through our{" "}
          <Link
            href={CONTACT_HREF}
            className="font-semibold text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Contact page
          </Link>{" "}
          and we will take appropriate steps to review and remove it.
        </P>
      </>
    ),
  },

  /* 17 ------------------------------------------------------------ */
  {
    id: "external-links",
    title: "External Links",
    body: (
      <>
        <P>
          Our articles and pages may link to external websites. We do not
          control these sites or their privacy practices and are not responsible
          for them. We encourage you to read the privacy policy of any website
          before sharing personal information with it.
        </P>
      </>
    ),
  },

  /* 18 ------------------------------------------------------------ */
  {
    id: "changes-to-this-policy",
    title: "Changes to This Policy",
    body: (
      <>
        <P>
          We may update this Privacy Policy as the website, our features, our
          service providers, and legal requirements change. When we do, we will
          update the “Last Updated” date at the top of this page.
        </P>
        <P>
          Please review this page from time to time. Continuing to use Alentah
          World after changes are posted means you accept the updated policy.
        </P>
      </>
    ),
  },
];

/* Section 19 (Contact Us) is rendered separately below, with its CTA */
const CONTACT_SECTION = { id: "contact-us", title: "Contact Us" } as const;

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

export function PrivacyContent() {
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
            Privacy &amp; Data Protection
            <span aria-hidden="true" className="hidden h-px w-24 bg-primary/60 sm:block" />
          </span>

          <h1 className="mb-6 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl xl:text-[3.5rem]">
            Your Privacy Matters. Your Trust Matters More.
          </h1>

          <p className={`mb-3 max-w-md text-base leading-relaxed text-foreground/80 ${cleanText}`}>
            At Alentah World, we respect your privacy and believe you should
            understand how information is collected, used, stored, and
            protected when you visit or interact with our publication.
          </p>
          <p className={`mb-8 max-w-md text-base leading-relaxed text-foreground/80 ${cleanText}`}>
            This Privacy Policy explains our practices and the choices
            available to you.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-foreground/75">
            <li className="flex items-center gap-2">
              <FileText className="size-4 text-primary" aria-hidden="true" />
              Document: Privacy Policy
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
      {/* 2. TOC + POLICY                                              */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-4 xl:col-span-3">
          <PrivacyToc items={TOC_ITEMS} />
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

            {/* 19. Contact */}
            <SectionShell
              id={CONTACT_SECTION.id}
              index={SECTIONS.length + 1}
              title={CONTACT_SECTION.title}
            >
              <div className="rounded-lg border border-border bg-primary/5 p-6 sm:p-8">
                <h3 className="mb-3 font-serif text-2xl font-bold leading-tight text-primary">
                  Questions About Your Privacy?
                </h3>
                <p className={`mb-6 max-w-xl text-[15px] leading-[1.8] text-foreground/80 ${cleanText}`}>
                  We believe that transparency is essential to earning
                  readers&apos; trust. If you have questions about this Privacy
                  Policy, wish to exercise an applicable privacy right, or have
                  concerns about how your information is handled, please
                  contact Alentah World through its official contact channel.
                </p>

                {PRIVACY_EMAIL && (
                  <p className={`mb-6 text-[15px] text-foreground/80 ${cleanText}`}>
                    Privacy email:{" "}
                    <a
                      href={`mailto:${PRIVACY_EMAIL}`}
                      className="font-semibold text-primary underline underline-offset-4"
                    >
                      {PRIVACY_EMAIL}
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
    </div>
  );
}
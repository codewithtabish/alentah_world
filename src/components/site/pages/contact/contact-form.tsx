// src/components/site/pages/contact/contact-form.tsx
"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Lock,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { submitContact } from "./submit-contact";
import { ContactField, ENQUIRY_TYPES, INITIAL_CONTACT_STATE } from "@/schemas/contact-schema";

const control =
  "w-full rounded-[3px] border bg-transparent text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group/btn inline-flex h-12 w-fit items-center gap-2.5 rounded-[3px] bg-primary px-7 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Sending…
        </>
      ) : (
        <>
          Send Message
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="text-xs font-bold text-foreground">
        {label} <span className="text-primary">*</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, INITIAL_CONTACT_STATE);
  const uid = useId();

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const id = (field: ContactField) => `${uid}-${field}`;

  const fieldProps = (field: ContactField) => ({
    id: id(field),
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${id(field)}-error` : undefined,
    className: cn(control, errors[field] ? "border-destructive" : "border-input"),
  });

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.status !== "idle" && state.message && (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "flex items-start gap-2.5 rounded-[3px] border px-4 py-3 text-[13px] leading-relaxed",
            state.status === "success"
              ? "border-emerald-600/30 text-emerald-800 dark:text-emerald-300"
              : "border-destructive/40 text-destructive",
          )}
        >
          {state.status === "success" ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          {state.message}
        </div>
      )}

      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute inset-s-[-9999px] size-px overflow-hidden opacity-0">
        <label htmlFor={`${uid}-company_website`}>Company website</label>
        <input
          id={`${uid}-company_website`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Full Name" error={errors.name}>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            defaultValue={values.name ?? ""}
            maxLength={100}
            required
            className={cn(fieldProps("name").className, "h-11 px-3.5")}
          />
        </Field>

        <Field id={id("email")} label="Email Address" error={errors.email}>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            defaultValue={values.email ?? ""}
            maxLength={254}
            required
            className={cn(fieldProps("email").className, "h-11 px-3.5")}
          />
        </Field>

        <Field id={id("subject")} label="Subject" error={errors.subject}>
          <input
            {...fieldProps("subject")}
            type="text"
            placeholder="How can we help?"
            defaultValue={values.subject ?? ""}
            maxLength={150}
            required
            className={cn(fieldProps("subject").className, "h-11 px-3.5")}
          />
        </Field>

        <Field id={id("enquiryType")} label="Enquiry Type" error={errors.enquiryType}>
          <div className="relative">
            <select
              {...fieldProps("enquiryType")}
              defaultValue={values.enquiryType ?? ""}
              required
              className={cn(
                fieldProps("enquiryType").className,
                "h-11 cursor-pointer appearance-none ps-3.5 pe-10",
              )}
            >
              <option value="" disabled>
                Select enquiry type
              </option>
              {ENQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute inset-e-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/60"
              aria-hidden="true"
            />
          </div>
        </Field>
      </div>

      <Field id={id("message")} label="Message" error={errors.message}>
        <textarea
          {...fieldProps("message")}
          rows={5}
          placeholder="Tell us more about your enquiry…"
          defaultValue={values.message ?? ""}
          maxLength={5000}
          required
          className={cn(fieldProps("message").className, "min-h-32 resize-y px-3.5 py-3")}
        />
      </Field>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3.5 shrink-0" aria-hidden="true" />
        Your information is safe with us. We use it only to respond to your
        enquiry.
      </p>

      <SubmitButton />
    </form>
  );
}
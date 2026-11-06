
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

import {
  ContactField,
  ENQUIRY_TYPES,
  INITIAL_CONTACT_STATE,
} from "@/schemas/contact-schema";

/* -------------------------------------------------------------------------- */
/* Shared form styles                                                         */
/* -------------------------------------------------------------------------- */

const control =
  "w-full rounded-[3px] border border-input bg-background text-sm text-foreground shadow-sm shadow-black/[0.02] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/60 hover:border-foreground/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

const inputControl = "h-11 px-3.5";

const selectControl =
  "h-11 cursor-pointer appearance-none ps-3.5 pe-11";

/* -------------------------------------------------------------------------- */
/* Submit button                                                              */
/* -------------------------------------------------------------------------- */

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group/btn inline-flex h-12 w-fit items-center gap-2.5 rounded-[3px] bg-primary px-7 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2
            className="size-4 animate-spin"
            aria-hidden="true"
          />
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

/* -------------------------------------------------------------------------- */
/* Form field wrapper                                                         */
/* -------------------------------------------------------------------------- */

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
      <label
        htmlFor={id}
        className="text-xs font-bold text-foreground"
      >
        {label} <span className="text-primary">*</span>
      </label>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs leading-relaxed text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact form                                                               */
/* -------------------------------------------------------------------------- */

export function ContactForm() {
  const [state, formAction] = useActionState(
    submitContact,
    INITIAL_CONTACT_STATE,
  );

  const uid = useId();

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  const id = (field: ContactField) => `${uid}-${field}`;

  const fieldProps = (field: ContactField) => ({
    id: id(field),
    name: field,
    "aria-invalid": errors[field] ? (true as const) : undefined,
    "aria-describedby": errors[field]
      ? `${id(field)}-error`
      : undefined,
    className: cn(
      control,
      errors[field] ? "border-destructive focus-visible:border-destructive" : "",
    ),
  });

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Submission feedback                                              */}
      {/* ---------------------------------------------------------------- */}

      {state.status !== "idle" && state.message && (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "flex items-start gap-2.5 rounded-[3px] border px-4 py-3 text-[13px] leading-relaxed",
            state.status === "success"
              ? "border-emerald-600/30 bg-emerald-600/5 text-emerald-800 dark:text-emerald-300"
              : "border-destructive/40 bg-destructive/5 text-destructive",
          )}
        >
          {state.status === "success" ? (
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
          )}

          <span>{state.message}</span>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Honeypot                                                         */}
      {/* ---------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className="absolute inset-s-[-9999px] size-px overflow-hidden opacity-0"
      >
        <label htmlFor={`${uid}-company_website`}>
          Company website
        </label>

        <input
          id={`${uid}-company_website`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Name, email, subject and enquiry type                            */}
      {/* ---------------------------------------------------------------- */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full name */}

        <Field
          id={id("name")}
          label="Full Name"
          error={errors.name}
        >
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            defaultValue={values.name ?? ""}
            maxLength={100}
            required
            className={cn(fieldProps("name").className, inputControl)}
          />
        </Field>

        {/* Email */}

        <Field
          id={id("email")}
          label="Email Address"
          error={errors.email}
        >
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            defaultValue={values.email ?? ""}
            maxLength={254}
            required
            className={cn(fieldProps("email").className, inputControl)}
          />
        </Field>

        {/* Subject */}

        <Field
          id={id("subject")}
          label="Subject"
          error={errors.subject}
        >
          <input
            {...fieldProps("subject")}
            type="text"
            placeholder="How can we help?"
            defaultValue={values.subject ?? ""}
            maxLength={150}
            required
            className={cn(fieldProps("subject").className, inputControl)}
          />
        </Field>

        {/* Enquiry type */}

        <Field
          id={id("enquiryType")}
          label="Enquiry Type"
          error={errors.enquiryType}
        >
          <div className="group/select relative">
            <select
              {...fieldProps("enquiryType")}
              defaultValue={values.enquiryType ?? ""}
              required
              className={cn(
                fieldProps("enquiryType").className,
                selectControl,
                "bg-background text-foreground",
                "dark:bg-[#201b1c] dark:text-[#f5efeb]",
                "focus-visible:ring-offset-2",
              )}
            >
              <option
                value=""
                disabled
                className="bg-background text-muted-foreground dark:bg-[#201b1c] dark:text-[#a99d9e]"
              >
                Select enquiry type
              </option>

              {ENQUIRY_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                  className="bg-background text-foreground dark:bg-[#201b1c] dark:text-[#f5efeb]"
                >
                  {type}
                </option>
              ))}
            </select>

            <ChevronDown
              className="pointer-events-none absolute inset-e-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-hover/select:text-primary"
              aria-hidden="true"
            />
          </div>
        </Field>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Message                                                           */}
      {/* ---------------------------------------------------------------- */}

      <Field
        id={id("message")}
        label="Message"
        error={errors.message}
      >
        <textarea
          {...fieldProps("message")}
          rows={5}
          placeholder="Tell us more about your enquiry…"
          defaultValue={values.message ?? ""}
          maxLength={5000}
          required
          className={cn(
            fieldProps("message").className,
            "min-h-32 resize-y px-3.5 py-3 leading-relaxed",
          )}
        />
      </Field>

      {/* ---------------------------------------------------------------- */}
      {/* Privacy note                                                      */}
      {/* ---------------------------------------------------------------- */}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Lock
          className="mt-0.5 size-3.5 shrink-0"
          aria-hidden="true"
        />

        <span>
          Your information is safe with us. We use it only to respond to your
          enquiry.
        </span>
      </p>

      {/* ---------------------------------------------------------------- */}
      {/* Submit                                                            */}
      {/* ---------------------------------------------------------------- */}

      <SubmitButton />
    </form>
  );
}

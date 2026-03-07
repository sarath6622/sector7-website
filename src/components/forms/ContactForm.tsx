"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  enquiryType: z.enum(
    ["membership", "personal-training", "corporate", "general"] as const,
    { error: "Please select an enquiry type" }
  ),
  message: z.string().min(10, "Message must be at least 10 characters"),
  _hp: z.literal("").optional(),
});

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full border border-border bg-surface text-white placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors font-body text-sm px-4 py-3";
const labelCls =
  "font-body text-xs font-semibold tracking-[0.2em] uppercase text-muted";
const errorCls = "font-body text-xs text-red-400 mt-1";

/**
 * ContactForm — general enquiry form.
 * Submits to /api/contact (wired in Phase 9).
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    if (data._hp) return;
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setServerError((json as { message?: string }).message ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle size={48} className="text-accent" />
        <h3 className="font-display text-3xl tracking-wide text-white uppercase">
          Message Sent!
        </h3>
        <p className="font-body text-muted text-sm max-w-sm leading-relaxed">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        {...register("_hp")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className={labelCls}>
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            className={cn(inputCls, errors.name && "border-red-500")}
            {...register("name")}
          />
          {errors.name && <span className={errorCls}>{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className={labelCls}>
            Mobile Number <span className="text-accent">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="9876543210"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
            className={cn(inputCls, errors.phone && "border-red-500")}
            {...register("phone")}
          />
          {errors.phone && <span className={errorCls}>{errors.phone.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className={labelCls}>
            Email{" "}
            <span className="text-muted normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={cn(inputCls, errors.email && "border-red-500")}
            {...register("email")}
          />
          {errors.email && <span className={errorCls}>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-type" className={labelCls}>
            Enquiry Type <span className="text-accent">*</span>
          </label>
          <select
            id="contact-type"
            className={cn(
              inputCls,
              "appearance-none cursor-pointer",
              errors.enquiryType && "border-red-500"
            )}
            defaultValue=""
            {...register("enquiryType")}
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="membership">Membership</option>
            <option value="personal-training">Personal Training</option>
            <option value="corporate">Corporate Wellness</option>
            <option value="general">General Enquiry</option>
          </select>
          {errors.enquiryType && (
            <span className={errorCls}>{errors.enquiryType.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className={labelCls}>
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us how we can help…"
          className={cn(
            inputCls,
            "resize-none leading-relaxed",
            errors.message && "border-red-500"
          )}
          {...register("message")}
        />
        {errors.message && (
          <span className={errorCls}>{errors.message.message}</span>
        )}
      </div>

      {serverError && (
        <p className="font-body text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-accent hover:bg-accent-hover text-white font-body font-semibold text-sm px-8 py-4 tracking-widest uppercase transition-colors accent-glow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

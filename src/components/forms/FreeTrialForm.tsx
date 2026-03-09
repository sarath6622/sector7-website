"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";

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
  preferredDate: z.string().min(1, "Please select a preferred date"),
  timeSlot: z.enum(["early-morning", "morning", "afternoon", "evening"] as const, {
    error: "Please select a time slot",
  }),
  goal: z.enum(
    ["weight-loss", "muscle-gain", "general-fitness", "crossfit", "other"] as const,
    { error: "Please select your primary goal" }
  ),
  referral: z.string().optional(),
  _hp: z.literal("").optional(),
});

type FormData = z.infer<typeof schema>;

const TIME_LABELS: Record<string, string> = {
  "early-morning": "Early Morning (5–7 AM)",
  "morning":       "Morning (7–11 AM)",
  "afternoon":     "Afternoon (11 AM–5 PM)",
  "evening":       "Evening (5–10 PM)",
};

const GOAL_LABELS: Record<string, string> = {
  "weight-loss":     "Weight Loss",
  "muscle-gain":     "Muscle Gain",
  "general-fitness": "General Fitness",
  "crossfit":        "CrossFit Training",
  "other":           "Other",
};

const inputCls =
  "w-full border border-border bg-surface text-white placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors font-body text-base px-4 py-3";
const labelCls =
  "font-body text-xs font-semibold tracking-[0.2em] uppercase text-muted";
const errorCls = "font-body text-xs text-red-400 mt-1";

/**
 * FreeTrialForm — conversion-focused trial booking form.
 * Submits to /api/trial (wired in Phase 9).
 * Shows inline success message on completion.
 */
export function FreeTrialForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    if (data._hp) return;

    const formattedDate = new Date(data.preferredDate).toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const message = WA_MESSAGES.trialBooking({
      name:     data.name,
      phone:    data.phone,
      date:     formattedDate,
      timeSlot: TIME_LABELS[data.timeSlot] ?? data.timeSlot,
      goal:     GOAL_LABELS[data.goal]     ?? data.goal,
    });

    const waUrl = buildWhatsAppURL({ message, source: "free-trial-form" });
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle size={48} className="text-accent" />
        <h3 className="font-display text-3xl tracking-wide text-white uppercase">
          You're Booked!
        </h3>
        <p className="font-body text-muted text-sm max-w-sm leading-relaxed">
          WhatsApp opened with your booking details. Send the message to confirm your free trial. We'll get back to you shortly!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        {...register("_hp")}
      />

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trial-name" className={labelCls}>
          Full Name <span className="text-accent">*</span>
        </label>
        <input
          id="trial-name"
          type="text"
          placeholder="Rahul Menon"
          autoComplete="name"
          className={cn(inputCls, errors.name && "border-red-500")}
          {...register("name")}
        />
        {errors.name && <span className={errorCls}>{errors.name.message}</span>}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trial-phone" className={labelCls}>
          Mobile Number <span className="text-accent">*</span>
        </label>
        <input
          id="trial-phone"
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

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trial-email" className={labelCls}>
          Email Address{" "}
          <span className="text-muted normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="trial-email"
          type="email"
          placeholder="rahul@example.com"
          autoComplete="email"
          className={cn(inputCls, errors.email && "border-red-500")}
          {...register("email")}
        />
        {errors.email && <span className={errorCls}>{errors.email.message}</span>}
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="trial-date" className={labelCls}>
            Preferred Date <span className="text-accent">*</span>
          </label>
          <input
            id="trial-date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className={cn(
              inputCls,
              "text-white [color-scheme:dark]",
              errors.preferredDate && "border-red-500"
            )}
            {...register("preferredDate")}
          />
          {errors.preferredDate && (
            <span className={errorCls}>{errors.preferredDate.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="trial-slot" className={labelCls}>
            Time Slot <span className="text-accent">*</span>
          </label>
          <select
            id="trial-slot"
            className={cn(
              inputCls,
              "appearance-none cursor-pointer",
              errors.timeSlot && "border-red-500"
            )}
            defaultValue=""
            {...register("timeSlot")}
          >
            <option value="" disabled>
              Select a slot
            </option>
            <option value="early-morning">Early Morning (5 – 7 AM)</option>
            <option value="morning">Morning (7 – 11 AM)</option>
            <option value="afternoon">Afternoon (11 AM – 5 PM)</option>
            <option value="evening">Evening (5 – 10 PM)</option>
          </select>
          {errors.timeSlot && (
            <span className={errorCls}>{errors.timeSlot.message}</span>
          )}
        </div>
      </div>

      {/* Goal */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trial-goal" className={labelCls}>
          Primary Goal <span className="text-accent">*</span>
        </label>
        <select
          id="trial-goal"
          className={cn(
            inputCls,
            "appearance-none cursor-pointer",
            errors.goal && "border-red-500"
          )}
          defaultValue=""
          {...register("goal")}
        >
          <option value="" disabled>
            What's your main goal?
          </option>
          <option value="weight-loss">Weight Loss</option>
          <option value="muscle-gain">Muscle Gain</option>
          <option value="general-fitness">General Fitness</option>
          <option value="crossfit">CrossFit Training</option>
          <option value="other">Other</option>
        </select>
        {errors.goal && <span className={errorCls}>{errors.goal.message}</span>}
      </div>

      {/* Referral */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trial-referral" className={labelCls}>
          How did you hear about us?{" "}
          <span className="text-muted normal-case tracking-normal">(optional)</span>
        </label>
        <select
          id="trial-referral"
          className={cn(inputCls, "appearance-none cursor-pointer")}
          defaultValue=""
          {...register("referral")}
        >
          <option value="">Select an option</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="google">Google Search</option>
          <option value="friend">Friend / Family</option>
          <option value="walked-by">Walked Past the Gym</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-accent hover:bg-accent-hover text-white font-body font-semibold text-sm px-8 py-4 tracking-widest uppercase transition-colors accent-glow mt-2"
      >
        Book My Free Trial →
      </button>

      <p className="font-body text-xs text-muted text-center">
        No credit card required. We'll call to confirm within 2 hours.
      </p>
    </form>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = "sector7_popup_shown";
const SCROLL_THRESHOLD = 0.45;   // 45% page depth
const TIMER_DELAY_MS  = 30_000;  // 30 seconds

// ── Mini form schema (name + phone + goal only) ───────────────────────────────
const schema = z.object({
  name:  z.string().min(2, "Enter your name"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  goal:  z.enum(
    ["weight-loss", "muscle-gain", "general-fitness", "crossfit", "other"] as const,
    { error: "Please select your goal" }
  ),
  _hp: z.literal("").optional(),
});

type FormData = z.infer<typeof schema>;

const inputCls =
  "w-full border border-border bg-bg-primary text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors font-body text-sm px-4 py-3";
const errorCls = "font-body text-xs text-red-400 mt-1";

const TRUST_BULLETS = [
  "3,000+ documented transformations",
  "Certified trainers — not just gym staff",
  "No commitment required",
];

// ── Component ─────────────────────────────────────────────────────────────────
export function TrialPopup() {
  const pathname = usePathname();
  const [mounted,    setMounted]    = useState(false);
  const [open,       setOpen]       = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Skip entirely on the /free-trial page
  const isTrialPage = pathname === "/free-trial";

  // ── Trigger (show once per session) ────────────────────────────────────────
  const trigger = useCallback(() => {
    if (isTrialPage) return;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage?.setItem(STORAGE_KEY, "1");
    setOpen(true);
  }, [isTrialPage]);

  // Portal mount guard
  useEffect(() => { setMounted(true); }, []);

  // Timer (30 s)
  useEffect(() => {
    if (isTrialPage) return;
    const t = setTimeout(trigger, TIMER_DELAY_MS);
    return () => clearTimeout(t);
  }, [trigger, isTrialPage]);

  // Scroll depth
  useEffect(() => {
    if (isTrialPage) return;
    const handler = () => {
      const depth =
        window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (depth >= SCROLL_THRESHOLD) trigger();
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [trigger, isTrialPage]);

  // Exit intent — desktop only (mouse leaves top of viewport)
  useEffect(() => {
    if (isTrialPage) return;
    const handler = (e: MouseEvent) => { if (e.clientY <= 0) trigger(); };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [trigger, isTrialPage]);

  // Keyboard: Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── Form submit ─────────────────────────────────────────────────────────────
  async function onSubmit(data: FormData) {
    if (data._hp) return;
    setServerError(null);
    setSubmitting(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const preferredDate = tomorrow.toISOString().split("T")[0];
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: "",
          preferredDate,
          timeSlot: "evening",
          referral: "popup",
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setServerError((json as { message?: string }).message ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="popup-backdrop"
            className="fixed inset-0 z-[150] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="popup-panel"
            className="fixed inset-0 z-[151] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Claim your free trial"
          >
            <div
              className="relative w-full max-w-2xl bg-bg-secondary border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                className="absolute top-3 right-3 z-10 p-1.5 text-muted hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => setOpen(false)}
                aria-label="Close popup"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr]">
                {/* ── Left: brand panel ──────────────────────────────────── */}
                <div className="bg-accent px-8 py-10 flex flex-col gap-6 justify-between">
                  <div className="flex flex-col gap-4">
                    <span className="font-body text-[10px] font-semibold tracking-[0.35em] uppercase text-white/60">
                      Limited Time
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl text-white uppercase leading-none tracking-wide">
                      Your First Session Is Free
                    </h2>
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      Walk in, train hard, see the difference. No strings attached.
                    </p>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {TRUST_BULLETS.map((line) => (
                      <li key={line} className="flex items-start gap-2.5">
                        <span className="text-white/70 mt-0.5 text-sm flex-shrink-0">✓</span>
                        <span className="font-body text-sm text-white/85 leading-snug">{line}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="font-body text-xs text-white/40">
                    We'll call you within 2 hours to confirm.
                  </p>
                </div>

                {/* ── Right: form ────────────────────────────────────────── */}
                <div className="px-8 py-10">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-8">
                      <CheckCircle size={44} className="text-accent" />
                      <h3 className="font-display text-3xl tracking-wide text-white uppercase">
                        You're In!
                      </h3>
                      <p className="font-body text-sm text-muted leading-relaxed max-w-xs">
                        We'll call you within 2 hours to schedule your free trial session.
                      </p>
                      <button
                        onClick={() => setOpen(false)}
                        className="font-body text-xs text-accent underline underline-offset-4 mt-2 hover:text-accent/80 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display text-2xl tracking-wide text-white uppercase mb-6">
                        Claim Your Free Trial
                      </h3>

                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="flex flex-col gap-4"
                      >
                        {/* Honeypot */}
                        <input
                          type="text"
                          tabIndex={-1}
                          aria-hidden="true"
                          className="absolute opacity-0 pointer-events-none"
                          {...register("_hp")}
                        />

                        {/* Name */}
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            className={cn(inputCls, errors.name && "border-red-500")}
                            {...register("name")}
                          />
                          {errors.name && <span className={errorCls}>{errors.name.message}</span>}
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1">
                          <input
                            type="tel"
                            placeholder="Mobile number (10 digits)"
                            autoComplete="tel"
                            inputMode="numeric"
                            maxLength={10}
                            className={cn(inputCls, errors.phone && "border-red-500")}
                            {...register("phone")}
                          />
                          {errors.phone && <span className={errorCls}>{errors.phone.message}</span>}
                        </div>

                        {/* Goal */}
                        <div className="flex flex-col gap-1">
                          <select
                            className={cn(
                              inputCls,
                              "appearance-none cursor-pointer",
                              errors.goal && "border-red-500"
                            )}
                            defaultValue=""
                            {...register("goal")}
                          >
                            <option value="" disabled>What&apos;s your goal?</option>
                            <option value="weight-loss">Weight Loss</option>
                            <option value="muscle-gain">Muscle Gain</option>
                            <option value="general-fitness">General Fitness</option>
                            <option value="crossfit">CrossFit Training</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.goal && <span className={errorCls}>{errors.goal.message}</span>}
                        </div>

                        {serverError && (
                          <p className="font-body text-xs text-red-400">{serverError}</p>
                        )}

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full bg-accent hover:bg-accent-hover text-white font-body font-semibold text-sm px-6 py-4 tracking-widest uppercase transition-colors accent-glow disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                        >
                          {submitting ? "Booking…" : "Claim Free Trial →"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="font-body text-xs text-muted hover:text-white/50 transition-colors text-center"
                        >
                          No thanks, I&apos;m not interested
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

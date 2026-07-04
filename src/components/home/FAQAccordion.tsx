"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

/**
 * FAQAccordion — animated single-open accordion.
 *
 * The answer text is ALWAYS rendered in the DOM (only visually collapsed via
 * height animation) so search crawlers and AI answer engines can read every
 * answer without triggering the expand interaction. Do not switch this to
 * conditional (`{isOpen && ...}`) rendering — it would hide the content from
 * bots and defeat the FAQPage structured data.
 */
export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-border border-t border-b border-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left gap-4 group"
              aria-expanded={isOpen}
            >
              <span
                className={cn(
                  "font-body text-base font-medium transition-colors",
                  isOpen ? "text-accent" : "text-white group-hover:text-accent"
                )}
              >
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={cn(
                  "flex-shrink-0 transition-all duration-200",
                  isOpen ? "rotate-180 text-accent" : "text-muted"
                )}
                aria-hidden="true"
              />
            </button>

            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: "hidden" }}
            >
              <p className="font-body text-sm text-muted leading-relaxed pb-5 max-w-2xl">
                {item.answer}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

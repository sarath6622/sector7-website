"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

/**
 * FAQAccordion — animated accordion using Framer Motion.
 * Single-open: opening one item closes the previous.
 */
export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-border border-t border-b border-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
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
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="font-body text-sm text-muted leading-relaxed pb-5 max-w-2xl">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

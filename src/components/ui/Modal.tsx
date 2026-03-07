"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  /** Controls visibility */
  isOpen: boolean;
  /** Called when backdrop or close button is clicked, or Escape is pressed */
  onClose: () => void;
  /** Modal title (rendered in the header) */
  title?: string;
  children: React.ReactNode;
  /** Max-width class for the panel (default "max-w-lg") */
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * Modal — accessible modal dialog with focus trap, Escape-to-close,
 * and scroll-lock. Rendered via React portal into document.body.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <Button onClick={() => setOpen(true)}>Open</Button>
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="Book a Trial">
 *     <FreeTrialForm />
 *   </Modal>
 */
export function Modal({ isOpen, onClose, title, children, size = "md", className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const shouldReduce = useReducedMotion();

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Focus trap — move focus into panel when open
  useEffect(() => {
    if (isOpen) {
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.[0]?.focus();
    }
  }, [isOpen]);

  if (typeof window === "undefined") return null;

  const backdropVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  };

  const panelVariants = {
    hidden:  { opacity: 0, y: shouldReduce ? 0 : 16, scale: shouldReduce ? 1 : 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: shouldReduce ? 0 : 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            variants={panelVariants}
            transition={{ duration: shouldReduce ? 0 : 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "relative z-10 w-full bg-surface border border-border rounded-lg overflow-hidden",
              sizeMap[size],
              className
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2
                  id="modal-title"
                  className="font-display text-2xl tracking-wide text-white uppercase"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="text-muted hover:text-white transition-colors p-1 -mr-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Close button (no title) */}
            {!title && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute top-4 right-4 z-10 text-muted hover:text-white transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            )}

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

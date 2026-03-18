import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import type { PortableTextBlock } from "@portabletext/types";

const TONE_STYLES: Record<string, string> = {
  info:    "border-blue-500/30 bg-blue-500/5 text-blue-300",
  warning: "border-yellow-500/30 bg-yellow-500/5 text-yellow-300",
  tip:     "border-accent/30 bg-accent/5 text-accent",
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-white/70 text-base leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl md:text-3xl tracking-wide text-white uppercase mt-8 mb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl md:text-2xl tracking-wide text-white uppercase mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-lg tracking-wide text-white uppercase mt-4 mb-1">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-4 my-4 font-body text-white/60 italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-5 flex flex-col gap-1.5 font-body text-white/70 text-base leading-relaxed">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-5 flex flex-col gap-1.5 font-body text-white/70 text-base leading-relaxed">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="bg-surface px-1.5 py-0.5 text-sm text-accent font-mono rounded">{children}</code>
    ),
    link: ({ children, value }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a href={value?.href} target={target} rel={rel} className="text-accent hover:text-white underline underline-offset-2 transition-colors">
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imgUrl = urlFor(value).width(800).auto("format").url();
      return (
        <figure className="my-6">
          <div className="relative w-full overflow-hidden rounded-sm border border-border" style={{ aspectRatio: "16/9" }}>
            <Image src={imgUrl} alt={value.alt || ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
          </div>
          {value.caption && (
            <figcaption className="font-body text-xs text-muted mt-2 text-center">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => {
      const tone = value?.tone || "tip";
      const styles = TONE_STYLES[tone] || TONE_STYLES.tip;
      return (
        <div className={`border-l-2 p-4 my-4 ${styles}`}>
          <p className="font-body text-sm leading-relaxed">{value?.text}</p>
        </div>
      );
    },
  },
};

export function PortableTextBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      <PortableText value={value} components={components} />
    </div>
  );
}

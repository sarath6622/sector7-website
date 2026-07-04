import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion, type FAQItem } from "@/components/home/FAQAccordion";

interface FAQProps {
  items: FAQItem[];
}

/**
 * FAQ — homepage FAQ section.
 *
 * Server Component wrapper around the client accordion: the question/answer
 * text is server-rendered (good for SEO / AI crawlers), while the matching
 * FAQPage JSON-LD is emitted by the page that renders this.
 */
export function FAQ({ items }: FAQProps) {
  if (!items.length) return null;

  return (
    <section className="py-20 md:py-28 bg-bg-primary border-t border-border">
      <div className="container-section flex flex-col gap-10">
        <SectionHeading label="FAQ" heading="Common <em>Questions</em>" />
        <FAQAccordion items={items} />
      </div>
    </section>
  );
}

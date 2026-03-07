import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface Review {
  name: string;
  rating: number;
  timeAgo: string;
  text: string;
}

const REVIEWS: Review[] = [
  {
    name: "Anoop Krishnan",
    rating: 5,
    timeAgo: "2 weeks ago",
    text: "Best gym in Kochi, hands down. The trainers genuinely care about your progress and the equipment is always well-maintained. Completely changed my physique in 6 months!",
  },
  {
    name: "Meera Suresh",
    rating: 5,
    timeAgo: "1 month ago",
    text: "I was nervous about joining a gym but SEC7OR made me feel so welcome. The CrossFit classes are intense but the coaches are incredibly supportive. Lost 15 kg and gained so much confidence!",
  },
  {
    name: "Rahul Varma",
    rating: 5,
    timeAgo: "3 weeks ago",
    text: "The facilities are world-class — clean, spacious, and packed with quality equipment. The 5 AM morning sessions are my favourite. Great community vibe and the trainers are motivating.",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < count ? "text-yellow-400 fill-yellow-400" : "text-border"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/**
 * GoogleReviews — aggregate rating + 3 featured review cards.
 * Server Component. Review data is currently hardcoded — connect to
 * a Google Places API call or Sanity testimonials schema in Phase 8.
 */
export function GoogleReviews() {
  return (
    <section className="py-20 md:py-28 bg-bg-secondary border-y border-border">
      <div className="container-section flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading
            label="Google Reviews"
            heading="What Our <em>Members</em> Say"
          />

          {/* Aggregate rating */}
          <div className="flex items-center gap-5 self-start md:self-auto">
            <div className="flex flex-col items-end gap-1">
              <span className="font-display text-5xl text-white leading-none">
                4.8
              </span>
              <StarRow count={5} />
              <span className="font-body text-xs text-muted mt-0.5">
                500+ Google reviews
              </span>
            </div>
            <div className="w-px h-14 bg-border" aria-hidden="true" />
            {/* "G" placeholder — replace with Google logo SVG */}
            <div className="flex flex-col items-center gap-0.5">
              <span
                className="font-display text-2xl leading-none"
                style={{ color: "#4285F4" }}
                aria-hidden="true"
              >
                G
              </span>
              <span className="font-body text-xs text-muted">Google</span>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <ScrollReveal key={review.name} delay={i * 0.08}>
              <article className="card-dark p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <StarRow count={review.rating} />
                  <span className="font-body text-xs text-muted">
                    {review.timeAgo}
                  </span>
                </div>

                <p className="font-body text-sm text-white/70 leading-relaxed flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div
                    className="w-8 h-8 rounded-full bg-surface flex items-center justify-center font-display text-sm text-accent flex-shrink-0"
                    aria-hidden="true"
                  >
                    {review.name[0]}
                  </div>
                  <span className="font-body text-sm font-medium text-white">
                    {review.name}
                  </span>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Link to all reviews */}
        <div className="text-center">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-muted hover:text-accent transition-colors"
          >
            {/* TODO: Replace href with your Google My Business reviews URL */}
            View all reviews on Google &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

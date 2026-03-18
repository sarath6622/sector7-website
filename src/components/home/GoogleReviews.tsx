import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { FEATURED_TESTIMONIALS_QUERY } from "@/lib/sanity/queries";

interface Review {
  name: string;
  rating: number;
  timeAgo: string;
  text: string;
}

// ── Static fallbacks (used when Sanity has no testimonials) ─────────────────
const STATIC_REVIEWS: Review[] = [
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

// ── Sanity testimonial type ─────────────────────────────────────────────────
interface SanityTestimonial {
  _id: string;
  reviewerName: string;
  rating: number;
  excerpt: string;
  source: string;
  date?: string;
}

function getRelativeTime(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 7) return days <= 1 ? "1 day ago" : `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

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
 * Server Component. Fetches from Sanity testimonials, falls back to static data.
 */
export async function GoogleReviews() {
  let reviews: Review[] = STATIC_REVIEWS;

  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<SanityTestimonial[]>(FEATURED_TESTIMONIALS_QUERY);
      if (data?.length) {
        reviews = data.map((t) => ({
          name: t.reviewerName,
          rating: t.rating,
          timeAgo: getRelativeTime(t.date),
          text: t.excerpt,
        }));
      }
    } catch { /* fall through to static */ }
  }

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
          {reviews.map((review, i) => (
            <ScrollReveal key={review.name} delay={i * 0.08}>
              <article className="card-dark p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <StarRow count={review.rating} />
                  {review.timeAgo && (
                    <span className="font-body text-xs text-muted">
                      {review.timeAgo}
                    </span>
                  )}
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
            href="https://maps.app.goo.gl/X4eBYAte3Cc2x4Ky9"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-muted hover:text-accent transition-colors"
          >
            View all reviews on Google &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

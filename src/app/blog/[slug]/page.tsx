import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppURL, WA_MESSAGES } from "@/lib/whatsapp";
import { formatDate } from "@/lib/utils";
import { sanityClient, urlFor, isSanityConfigured } from "@/lib/sanity/client";
import {
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import { BLOG_POSTS } from "@/app/blog/page";
import { TRAINERS } from "@/app/trainers/page";

export const revalidate = 3600;

// ── Static post content ───────────────────────────────────────────────────────
interface PostContent {
  slug: string;
  sections: { heading?: string; body: string }[];
}

const POST_CONTENT: PostContent[] = [
  {
    slug: "compound-lifts-beginners",
    sections: [
      { body: "Walk into any gym and you'll find rows of machines, cables, and gadgets promising to isolate every muscle in your body. Most beginners spend their first months rotating through these machines — and making very slow progress. Here's why: machines don't build the foundational strength and movement patterns your body needs." },
      { heading: "1. The Squat", body: "The squat is the king of lower body movements. It trains your quads, hamstrings, glutes, lower back, and core simultaneously. Master the bodyweight squat before adding a barbell — focus on depth, heel contact, and a neutral spine. Most beginners can start adding load within 2–4 weeks." },
      { heading: "2. The Deadlift", body: "Nothing builds posterior chain strength like the conventional deadlift. It teaches you to hinge at the hips — a movement pattern essential for daily life and injury prevention. Start with a Romanian deadlift to learn the hinge before loading a full conventional pull." },
      { heading: "3. The Bench Press", body: "Upper body pushing strength. The barbell bench press loads the chest, anterior delts, and triceps in a way no machine can replicate. Key cue: think about pulling the bar apart and driving your shoulder blades into the bench. This protects the shoulder joint under load." },
      { heading: "4. The Overhead Press", body: "Strict overhead pressing builds shoulder stability and full-body tension awareness. It's also the best indicator of raw pressing strength — you can't cheat it with momentum. Start light, nail the bracing, and build from there." },
      { heading: "5. The Pull-Up / Barbell Row", body: "Upper body pulling strength is chronically underdeveloped in most trainees. If you can't do pull-ups yet, start with assisted pull-ups or lat pulldowns. Pair vertical pulling with horizontal rowing (barbell or cable rows) for complete back development." },
      { body: "Master these five movements and you will have built more muscle and strength than most people achieve in years of machine-based training. Start at SEC7OR with one of our strength coaches — your first session is free." },
    ],
  },
  {
    slug: "crossfit-vs-traditional-gym",
    sections: [
      { body: "The internet has made this question tribal. CrossFit people say traditional gym training is boring and ineffective. Traditional lifters say CrossFit is dangerous and produces inferior results. Both groups are wrong — or at least incomplete." },
      { heading: "What Traditional Gym Training Does Well", body: "Structured hypertrophy programming, strength sport prep (powerlifting, Olympic lifting), body recomposition, and long-term progressive overload. If your goal is building maximum muscle or getting very strong at specific lifts, traditional periodized programming is hard to beat." },
      { heading: "What CrossFit Does Well", body: "Conditioning, community accountability, movement variety, and developing broad physical capacity. CrossFit athletes are genuinely fit in the widest sense — they can run, lift, row, climb, and sprint. If you want to be 'generally athletic', CrossFit is an excellent vehicle." },
      { heading: "The Real Question", body: "What do you actually want? If you want to look good on a beach, either works. If you want to compete in powerlifting, skip CrossFit. If you want to run a half marathon and also deadlift heavy, CrossFit might suit you better. If you hate group classes, traditional training is the answer regardless." },
      { body: "At SEC7OR we have both — a fully equipped strength floor and a proper CrossFit box. Come in for a free trial and try both. You'll know within one session which one speaks to you." },
    ],
  },
  {
    slug: "nutrition-basics-transformation",
    sections: [
      { body: "Every month, new dietary theories trend online. Carnivore this week, intermittent fasting the next. Meanwhile, the fundamentals of body transformation nutrition haven't changed in decades. Here's what actually matters." },
      { heading: "Calories First", body: "Body weight is primarily determined by energy balance — calories in vs calories out. To lose fat, eat less than you burn. To gain muscle, eat slightly more. This is non-negotiable and no dietary philosophy changes it. Everything else is secondary." },
      { heading: "Protein Second", body: "Protein is the most important macronutrient for body composition. It preserves muscle during a cut, builds muscle during a bulk, and keeps you full. Aim for 1.6–2.2g per kg of bodyweight daily. This is higher than most people eat and lower than most fitness influencers recommend." },
      { heading: "Fill the Rest with Foods You Enjoy", body: "Carbs and fats can be distributed however you prefer, based on food preferences and meal timing around training. You don't need to eat chicken and rice. You can eat South Indian food, dal, roti — whatever works for your lifestyle and culture. Sustainability is everything." },
      { heading: "Tracking", body: "Track your food for at least 4 weeks at the start. Not forever — just long enough to understand portion sizes and calorie density. Most people are shocked by how much (or how little) they're actually eating. Data beats guessing." },
      { body: "At SEC7OR, every transformation client gets a nutrition consultation with Rohit Kumar. Book your free trial and we'll assess your current nutrition and give you a starting framework at no extra cost." },
    ],
  },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (isSanityConfigured) {
    try {
      const data = await sanityClient.fetch<{ slug: string }[]>(BLOG_SLUGS_QUERY);
      if (data?.length) return data.map(({ slug }) => ({ slug }));
    } catch { /* fall through */ }
  }
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (isSanityConfigured) {
    try {
      const p = await sanityClient.fetch<{ title: string; excerpt: string; seoTitle?: string; seoDescription?: string } | null>(
        BLOG_POST_BY_SLUG_QUERY, { slug }
      );
      if (p) return { title: `${p.seoTitle ?? p.title} — SEC7OR Fitness Blog`, description: p.seoDescription ?? p.excerpt };
    } catch { /* fall through */ }
  }
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: `${post.title} — SEC7OR Fitness Blog`, description: post.excerpt };
}

interface SanityPost {
  _id: string; title: string; slug: string;
  featuredImage?: { asset?: { _ref: string } };
  excerpt: string; category: string; body?: unknown;
  publishedAt: string; readTime?: number;
  authorName?: string; authorSlug?: string;
  authorTitle?: string; authorBio?: string;
  authorPhoto?: { asset?: { _ref: string } };
  relatedPosts?: Array<{ _id: string; title: string; slug: string; featuredImage?: { asset?: { _ref: string } }; category: string; publishedAt: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let sanityPost: SanityPost | null = null;
  if (isSanityConfigured) {
    try { sanityPost = await sanityClient.fetch(BLOG_POST_BY_SLUG_QUERY, { slug }); }
    catch { /* fall through */ }
  }

  const staticPost    = BLOG_POSTS.find((p) => p.slug === slug);
  const staticContent = POST_CONTENT.find((c) => c.slug === slug);
  const staticAuthor  = TRAINERS.find((t) => t.slug === staticPost?.authorSlug);

  if (!sanityPost && !staticPost) notFound();

  const title      = sanityPost?.title       ?? staticPost!.title;
  const category   = sanityPost?.category    ?? staticPost!.category;
  const excerpt    = sanityPost?.excerpt     ?? staticPost!.excerpt;
  const date       = sanityPost?.publishedAt ?? staticPost!.date;
  const readTime   = sanityPost?.readTime ? `${sanityPost.readTime} min read` : staticPost!.readTime;
  const authorName  = sanityPost?.authorName  ?? staticPost?.author   ?? "SEC7OR Team";
  const authorSlug  = sanityPost?.authorSlug  ?? staticPost?.authorSlug;
  const authorTitle = sanityPost?.authorTitle ?? staticAuthor?.title  ?? "";
  const authorBio   = sanityPost?.authorBio   ?? staticAuthor?.bio    ?? "";
  const heroGradient = staticPost?.gradient
    ?? "radial-gradient(ellipse at 50% 50%, rgba(255,85,0,0.25) 0%, rgba(10,10,10,0.97) 70%)";

  const heroImageUrl   = sanityPost?.featuredImage?.asset   ? urlFor(sanityPost.featuredImage).width(1200).height(600).url()  : null;
  const authorPhotoUrl = sanityPost?.authorPhoto?.asset     ? urlFor(sanityPost.authorPhoto).width(80).height(80).url()       : null;

  const staticRelated = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      {/* Back */}
      <div className="bg-bg-secondary border-b border-border pt-24 pb-0">
        <div className="container-section py-4">
          <Link href="/blog" className="flex items-center gap-2 font-body text-sm text-muted hover:text-accent transition-colors">
            <ArrowLeft size={14} /> All Articles
          </Link>
        </div>
      </div>

      {/* Post header */}
      <section className="bg-bg-secondary border-b border-border">
        <div className="container-section py-12 md:py-16 max-w-3xl">
          <div className="flex flex-col gap-5">
            <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase text-accent">{category}</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-white uppercase leading-none">{title}</h1>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                {authorPhotoUrl ? (
                  <Image src={authorPhotoUrl} alt={authorName} width={32} height={32} className="rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-display text-sm text-accent">
                    {authorName[0]}
                  </div>
                )}
                <div>
                  {authorSlug ? (
                    <Link href={`/trainers/${authorSlug}`} className="font-body text-sm font-medium text-white hover:text-accent transition-colors">{authorName}</Link>
                  ) : (
                    <span className="font-body text-sm font-medium text-white">{authorName}</span>
                  )}
                  {authorTitle && <p className="font-body text-xs text-muted">{authorTitle}</p>}
                </div>
              </div>
              <div className="w-px h-8 bg-border" aria-hidden="true" />
              <div className="font-body text-xs text-muted">
                <p>{formatDate(date)}</p>
                <p>{readTime}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <div className="w-full relative overflow-hidden" style={{ height: "320px", background: heroGradient }} aria-hidden={!heroImageUrl}>
        {heroImageUrl && <Image src={heroImageUrl} alt={title} fill className="object-cover" priority sizes="100vw" />}
      </div>

      {/* Article body */}
      <article className="py-16 bg-bg-primary border-b border-border">
        <div className="container-section max-w-2xl">
          <div className="flex flex-col gap-6">
            {staticContent?.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-2">
                {section.heading && (
                  <h2 className="font-display text-2xl tracking-wide text-white uppercase mt-4">{section.heading}</h2>
                )}
                <p className="font-body text-white/70 text-base leading-relaxed">{section.body}</p>
              </div>
            ))}
            {!staticContent && sanityPost && (
              <p className="font-body text-white/70 text-base leading-relaxed">{excerpt}</p>
            )}
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-12 p-6 border border-accent/20 bg-accent/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-display text-xl tracking-wide text-white uppercase">Ready to apply this?</p>
              <p className="font-body text-sm text-muted mt-1">Your first training session at SEC7OR is completely free.</p>
            </div>
            <Button variant="whatsapp" href={buildWhatsAppURL({ message: WA_MESSAGES.blog(title), source: `blog-${slug}` })} external size="sm">
              Chat with Us
            </Button>
          </div>
        </div>
      </article>

      {/* Author bio */}
      {authorName !== "SEC7OR Team" && (
        <section className="py-12 bg-bg-secondary border-b border-border">
          <div className="container-section max-w-2xl">
            <div className="card-dark p-6 flex gap-5">
              <div className="w-20 h-20 rounded-full flex-shrink-0 border border-border overflow-hidden relative">
                {authorPhotoUrl ? (
                  <Image src={authorPhotoUrl} alt={authorName} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full" style={{ background: staticAuthor?.gradient ?? "radial-gradient(ellipse at 50% 50%, rgba(255,85,0,0.25) 0%, rgba(20,20,20,0.95) 65%)" }} />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-body text-xs text-muted tracking-wider uppercase">Written by</span>
                {authorSlug ? (
                  <Link href={`/trainers/${authorSlug}`} className="font-display text-2xl tracking-wide text-white uppercase hover:text-accent transition-colors">{authorName}</Link>
                ) : (
                  <span className="font-display text-2xl tracking-wide text-white uppercase">{authorName}</span>
                )}
                {authorTitle && <p className="font-body text-xs text-accent">{authorTitle}</p>}
                {authorBio && <p className="font-body text-sm text-muted leading-relaxed mt-1 line-clamp-2">{authorBio}</p>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related posts */}
      {(() => {
        const related = sanityPost?.relatedPosts?.length
          ? sanityPost.relatedPosts
          : staticRelated.map((p) => ({ _id: p.slug, slug: p.slug, title: p.title, category: p.category, publishedAt: p.date, featuredImage: undefined as undefined }));
        if (!related.length) return null;
        return (
          <section className="py-16 bg-bg-primary">
            <div className="container-section flex flex-col gap-8">
              <h2 className="font-display text-3xl tracking-wide text-white uppercase">More Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {related.map((p) => {
                  const relImg = p.featuredImage?.asset ? urlFor(p.featuredImage).width(320).height(320).url() : null;
                  const relGrad = BLOG_POSTS.find((b) => b.slug === p.slug)?.gradient ?? "radial-gradient(ellipse at 50% 50%, rgba(255,85,0,0.20) 0%, rgba(10,10,10,0.97) 70%)";
                  return (
                    <Link key={p._id} href={`/blog/${p.slug}`} className="card-dark overflow-hidden group flex gap-4 p-5">
                      <div className="w-20 h-20 flex-shrink-0 rounded relative overflow-hidden" style={{ background: relGrad }}>
                        {relImg && <Image src={relImg} alt={p.title} fill className="object-cover" sizes="80px" />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-body text-[10px] text-accent tracking-wider uppercase">{p.category}</span>
                        <span className="font-display text-lg tracking-wide text-white uppercase group-hover:text-accent transition-colors leading-tight">{p.title}</span>
                        <span className="font-body text-xs text-muted">{formatDate(p.publishedAt)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}
    </>
  );
}

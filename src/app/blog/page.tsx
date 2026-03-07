import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { formatDate } from "@/lib/utils";
import { sanityClient, urlFor, isSanityConfigured } from "@/lib/sanity/client";
import { ALL_BLOG_POSTS_QUERY } from "@/lib/sanity/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — SEC7OR Fitness",
  description:
    "Training tips, nutrition advice, and transformation stories from SEC7OR Fitness coaches in Kochi.",
};

// ── Sanity data type ─────────────────────────────────────────────────────────
interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: { asset?: { _ref: string } };
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime?: number;
  authorName?: string;
  authorSlug?: string;
}

interface DisplayPost {
  key: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  authorSlug: string;
  date: string;
  readTime: string;
  excerpt: string;
  imageUrl?: string;
}

const CATEGORIES = ["All", "Training", "CrossFit", "Nutrition", "Recovery", "Lifestyle"];

const DEFAULT_GRADIENT = "radial-gradient(ellipse at 40% 60%, rgba(255,85,0,0.25) 0%, rgba(10,10,10,0.97) 70%)";

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPage() {
  let posts: DisplayPost[] = [];

  if (isSanityConfigured) {
    try {
      const sanityPosts = await sanityClient.fetch<SanityBlogPost[]>(ALL_BLOG_POSTS_QUERY);
      if (sanityPosts?.length) {
        posts = sanityPosts.map((p) => ({
          key: p._id,
          slug: p.slug,
          title: p.title,
          category: p.category,
          author: p.authorName ?? "SEC7OR Team",
          authorSlug: p.authorSlug ?? "",
          date: p.publishedAt,
          readTime: p.readTime ? `${p.readTime} min read` : "5 min read",
          excerpt: p.excerpt,
          imageUrl: p.featuredImage?.asset
            ? urlFor(p.featuredImage).width(800).height(500).url()
            : undefined,
        }));
      }
    } catch { /* fall through */ }
  }

  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <>
        <PageHero
          label="Fitness Insights"
          heading="The <em>Blog</em>"
          subtitle="Training knowledge, nutrition science, and real stories from the SEC7OR coaching team."
        />
        <section className="py-20 bg-bg-primary">
          <div className="container-section text-center">
            <p className="font-body text-muted text-sm">Articles coming soon.</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        label="Fitness Insights"
        heading="The <em>Blog</em>"
        subtitle="Training knowledge, nutrition science, and real stories from the SEC7OR coaching team."
      />

      {/* Category chips */}
      <div className="bg-bg-secondary border-b border-border">
        <div className="container-section py-4 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((cat, i) => (
            <span
              key={cat}
              className={`font-body text-xs font-semibold tracking-wider uppercase px-4 py-2 flex-shrink-0 ${i === 0
                  ? "bg-accent text-white"
                  : "border border-border text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
                }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <section className="py-20 md:py-28 bg-bg-primary">
        <div className="container-section flex flex-col gap-12">
          {/* Featured post */}
          <ScrollReveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="card-dark grid grid-cols-1 lg:grid-cols-2 overflow-hidden group"
            >
              <div
                className="relative overflow-hidden"
                style={{ minHeight: "300px", background: featured.imageUrl ? undefined : DEFAULT_GRADIENT }}
              >
                {featured.imageUrl && (
                  <Image
                    src={featured.imageUrl}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <span className="absolute top-4 left-4 bg-accent text-white font-body text-xs font-semibold px-2 py-1 tracking-wider uppercase z-10">
                  {featured.category}
                </span>
              </div>
              <div className="p-8 flex flex-col gap-4 justify-center">
                <span className="font-body text-xs text-muted tracking-wider">
                  {formatDate(featured.date)} · {featured.readTime}
                </span>
                <h2 className="font-display text-3xl md:text-4xl tracking-wide text-white uppercase group-hover:text-accent transition-colors">
                  {featured.title}
                </h2>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center font-display text-xs text-accent">
                    {featured.author[0]}
                  </div>
                  <span className="font-body text-sm text-muted">{featured.author}</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Post grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map((post, i) => (
                <ScrollReveal key={post.key} delay={i * 0.08}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="card-dark overflow-hidden group flex flex-col h-full"
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        height: "200px",
                        background: post.imageUrl ? undefined : DEFAULT_GRADIENT,
                      }}
                    >
                      {post.imageUrl && (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                      <span className="absolute top-4 left-4 bg-accent text-white font-body text-xs font-semibold px-2 py-1 tracking-wider uppercase z-10">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <span className="font-body text-xs text-muted tracking-wider">
                        {formatDate(post.date)} · {post.readTime}
                      </span>
                      <h2 className="font-display text-2xl tracking-wide text-white uppercase group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      <p className="font-body text-white/60 text-sm leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 pt-2 border-t border-border mt-auto">
                        <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center font-display text-xs text-accent">
                          {post.author[0]}
                        </div>
                        <span className="font-body text-xs text-muted">{post.author}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

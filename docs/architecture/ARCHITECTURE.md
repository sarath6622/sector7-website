# Architecture — Sector 7 Gym Website

> Last updated: 2026-03-07

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14+ | App Router, Server Components by default |
| Language | TypeScript | strict: true, zero `any` types |
| Styling | Tailwind CSS v4 + CSS custom properties | Color tokens defined as CSS variables |
| Animations | Framer Motion | Page transitions, scroll reveals, micro-interactions |
| Icons | Lucide React | — |
| Forms | React Hook Form + Zod | Client-side validation + server-side Zod parsing |
| CMS | Sanity.io | Headless, GROQ queries, webhook-based ISR revalidation |
| Image Handling | Next.js Image + Sanity CDN | AVIF/WebP, blur-up placeholders |
| Analytics | GA4 + Microsoft Clarity | Custom events, heatmaps, session recordings |
| SEO | next-sitemap + JSON-LD | Structured data on all pages |
| WhatsApp | Click-to-chat API | Contextual prefilled messages, no backend required |
| Deployment | Vercel | Edge Functions for API routes, ISR |
| Email | Resend | Form submission notifications |

---

## Folder Structure

```
sector7-website/                  (project root inside "Sector 7/")
├── public/
│   ├── fonts/                    # Self-hosted woff2 files
│   ├── images/                   # Logo, favicon, OG images
│   └── robots.txt
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (fonts, metadata, global components)
│   │   ├── page.tsx              # Homepage
│   │   ├── facilities/page.tsx
│   │   ├── trainers/
│   │   │   ├── page.tsx          # Trainer listing
│   │   │   └── [slug]/page.tsx   # Individual trainer
│   │   ├── transformations/page.tsx
│   │   ├── about/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing
│   │   │   └── [slug]/page.tsx   # Blog post
│   │   ├── contact/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── free-trial/page.tsx   # Conversion landing page (minimal nav)
│   │   ├── api/
│   │   │   ├── contact/route.ts
│   │   │   ├── trial/route.ts
│   │   │   ├── newsletter/route.ts
│   │   │   └── revalidate/route.ts
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── layout/               # Navbar, Footer, WhatsAppFAB, MobileBottomCTA, PageTransition
│   │   ├── home/                 # Hero, Highlights, FacilitiesPreview, TransformationPreview, TrainersPreview, GoogleReviews, LocationPreview, CTABanner
│   │   ├── facilities/           # FacilityZone, ImageGallery
│   │   ├── trainers/             # TrainerCard, TrainerProfile
│   │   ├── transformations/      # BeforeAfterSlider, TransformationCard
│   │   ├── blog/                 # BlogCard, BlogContent
│   │   ├── ui/                   # Button, SectionHeading, AnimatedCounter, ScrollReveal, GrainOverlay, Skeleton, Modal
│   │   └── forms/                # FreeTrialForm, ContactForm, NewsletterForm
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts
│   │   │   └── queries.ts
│   │   ├── whatsapp.ts
│   │   ├── seo.ts
│   │   ├── analytics.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useScrollReveal.ts
│   │   ├── useMediaQuery.ts
│   │   └── useIntersectionObserver.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── sanity/
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   └── schemas/
│       ├── trainer.ts
│       ├── transformation.ts
│       ├── blogPost.ts
│       ├── facility.ts
│       ├── pricingPlan.ts
│       ├── testimonial.ts
│       └── siteSettings.ts
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Data Flow

```
Browser → Next.js App Router
  ├── Server Components → fetch from Sanity (server-side, cached with ISR)
  │     └── revalidation triggered by Sanity webhook → /api/revalidate
  ├── Client Components → Framer Motion, React Hook Form, browser APIs
  └── API Routes → form submissions → Resend (email) + validation + rate limiting
```

## Rendering Strategy

> Last updated: 2026-03-07 — Full Sanity CMS Migration complete. All pages now fetch from Sanity with ISR.
> Homepage (`page.tsx`) is an **async server component** that fetches trainers and featured transformations and passes as props to preview components.

| Page | Strategy | Revalidation | Sanity source |
|---|---|---|---|
| Homepage | ISR 1h | Webhook / `revalidatePath` | trainers + transformations |
| Facilities | ISR 1h | Webhook | facility docs |
| Trainers listing | ISR 1h | Webhook | trainer docs |
| Trainer [slug] | ISR 1h | Webhook | trainer by slug |
| Transformations | ISR 1h | Webhook | transformation docs |
| About | ISR 1h | Webhook | siteSettings.timelineEvents / gymValues |
| Blog listing | ISR 1h | Webhook | post docs |
| Blog [slug] | ISR 1h | Webhook | post by slug |
| Pricing | ISR 1h | Webhook | pricingPlan docs + siteSettings.faqs |
| Contact | Static | — | — |
| Free Trial | Static | — | — |
| API routes | Dynamic | — | — |

## Environment Variables

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                          # Server-only (NOT NEXT_PUBLIC_)

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX

# Google
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_PLACE_ID=

# Site
NEXT_PUBLIC_SITE_URL=https://sector7gym.com
NEXT_PUBLIC_SITE_NAME=Sector 7

# Email
RESEND_API_KEY=
NOTIFICATION_EMAIL=info@sector7gym.com

# Sanity ISR
SANITY_REVALIDATE_SECRET=
```

---

## Security Architecture

- HTTPS enforced (Vercel default)
- CSP headers in `next.config.ts`
- Rate limiting on `/api/contact`, `/api/trial`, `/api/newsletter` (3 req/IP/hour)
- Honeypot fields on all public forms
- Server secrets never prefixed with `NEXT_PUBLIC_`
- All user inputs sanitized server-side before email dispatch

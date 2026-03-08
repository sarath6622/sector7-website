# Changelog — Sector 7 Gym Website

> Updated after every session. Read before each session.

---

## [2026-03-07] — Phase 1: Init
- Created CLAUDE.md, docs/ folder structure (all 8 doc files)

## [2026-03-07] — Phase 2: Scaffold
- Next.js 16.1.6 + React 19, Tailwind v4, all deps installed
- globals.css (design tokens), layout.tsx, types/, lib/, hooks/ created
- Build ✅

## [2026-03-07] — Phase 4: Layout Components
- Navbar, Footer, WhatsAppFAB, MobileBottomCTA, PageTransition
- Build ✅

## [2026-03-07] — Phase 5: Shared UI + Brand Update
- Logo, Button, SectionHeading, AnimatedCounter, ScrollReveal, GrainOverlay, Skeleton, Modal
- Accent updated #FF3A3A → #FF5500
- Build ✅

## [2026-03-07] — Phase 6: Homepage Sections
- Hero, Highlights, FacilitiesPreview, TransformationPreview, TrainersPreview, GoogleReviews, LocationPreview (real Maps embed), CTABanner
- CSP fix: frame-src uses origin not path
- Build ✅

## [2026-03-07] — Phase 7: Inner Pages (all)
- PageHero, FAQAccordion, FreeTrialForm, ContactForm (components)
- Pages: /facilities, /trainers, /trainers/[slug]×6, /transformations, /about, /blog, /blog/[slug]×3, /pricing, /contact, /free-trial, /not-found, /error
- Build ✅ (21 pages)

## [2026-03-07] — Phase 7: Git + Build Fixes
- Pushed to GitHub: https://github.com/sarath6622/sector7-website.git
- Fixed: WA_MESSAGES.trainer() call, Zod v4 enum syntax
- Build ✅

## [2026-03-07] — Phase 8: Sanity CMS Integration

### Added
- `sanity/schemas/` — blockContent, trainer, transformation, blogPost, facility, pricingPlan, testimonial, siteSettings, index (9 files)
- `sanity.config.ts` — Studio config, custom structure (Site Settings singleton + all collections)
- `src/app/studio/[[...tool]]/layout.tsx` + `page.tsx` — Embedded Studio (ssr:false via next/dynamic)
- `src/app/api/revalidate/route.ts` — ISR webhook handler

### Changed
- `src/lib/sanity/client.ts` — urlFor(), SanityImageInput, isSanityConfigured, sentinel projectId ("unconfigured")
- `src/lib/sanity/queries.ts` — slugs flattened, yearsExperience aliased, new fields
- `src/app/trainers/page.tsx`, `[slug]/page.tsx` — ISR 1h, Sanity-first
- `src/app/blog/page.tsx`, `[slug]/page.tsx` — ISR 1h, Sanity-first
- `package.json` — cross-env NODE_OPTIONS=--max-old-space-size=4096 build script
- `next.config.ts` — Split CSP: /studio gets relaxed, others full
- `CLAUDE.md` — Phase 8 ✅

### Build verification
- `npm run build` ✅ — 22 pages, zero TypeScript errors
- /studio → Dynamic (ƒ), /blog + /trainers → ISR 1h revalidate

### To activate Sanity
1. https://www.sanity.io/manage → New Project
2. .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN, SANITY_REVALIDATE_SECRET
3. Visit /studio, add content
4. Webhook: URL=https://domain.com/api/revalidate?secret=VALUE, trigger create/update/delete, projection { _type, slug }

---

## [2026-03-07] — Phase 9: API Routes + Form Wiring

### Fixed
- `src/app/studio/[[...tool]]/page.tsx` — Studio now shows setup instructions instead of crashing when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset (lazy dynamic import only runs when configured)

### Added
- `resend` npm package installed
- `src/lib/rateLimit.ts` — in-memory rate limiter (3 req/IP/hour), shared across all form routes
- `src/app/api/contact/route.ts` — Zod validation, honeypot, rate limit, Resend notification + auto-reply
- `src/app/api/trial/route.ts` — Zod validation, honeypot, rate limit, Resend notification + confirmation email with WhatsApp link
- `src/app/api/newsletter/route.ts` — Zod validation, honeypot, rate limit, Resend welcome email

### Changed
- `src/components/forms/ContactForm.tsx` — wired to `/api/contact`, server error display
- `src/components/forms/FreeTrialForm.tsx` — wired to `/api/trial`, server error display
- `CLAUDE.md` — Phase 9 ✅

### Build verification
- `npm run build` ✅ — 25 pages, zero TypeScript errors
- /api/contact, /api/trial, /api/newsletter, /api/revalidate → Dynamic (ƒ)

### To activate email
1. Create Resend account: https://resend.com
2. Add to `.env.local`: `RESEND_API_KEY=re_...`
3. Add: `NOTIFICATION_EMAIL=your@email.com`
4. Add: `FROM_EMAIL=SEC7OR Fitness <noreply@yourdomain.com>`
5. Verify your sending domain in Resend dashboard

### Next session
- Phase 10: SEO + Analytics (generateMetadata, JSON-LD, GA4, sitemap, robots.txt)

---

## [2026-03-07] — Trainer Slug Null-Safety Fix

### Fixed
- `src/app/trainers/[slug]/page.tsx` — replaced all `staticTrainer!.X` non-null assertions with safe optional chaining and defaults to prevent crash when a trainer exists in Sanity but not in the static array

### Build verification
- `npm run build` ✅

---

## [2026-03-07] — Full Sanity CMS Migration

### Added
- `SITE_SETTINGS_ABOUT_QUERY` in `src/lib/sanity/queries.ts`
- `FAQS_QUERY` in `src/lib/sanity/queries.ts`
- `timelineEvents`, `gymValues`, `faqs` array fields on `siteSettings` Sanity schema
- `TrainerPreviewItem` + `TransformationPreviewItem` interfaces exported from homepage components

### Changed
- `src/app/page.tsx` — `async` server component; fetches trainers + transformations from Sanity, passes as props
- `src/components/home/TrainersPreview.tsx` — removed static array; accepts `trainers: TrainerPreviewItem[]` prop
- `src/components/home/TransformationPreview.tsx` — removed static array; accepts `items: TransformationPreviewItem[]` prop
- `src/app/trainers/page.tsx` — Sanity-only, empty-state if no data
- `src/app/trainers/[slug]/page.tsx` — Sanity-only, 404 if slug missing
- `src/app/blog/page.tsx` — Sanity-only, empty-state if no data
- `src/app/blog/[slug]/page.tsx` — removed static BLOG_POSTS/TRAINERS imports; related posts via Sanity only
- `src/app/pricing/page.tsx` — Sanity plans + FAQs; static arrays as fallback
- `src/app/facilities/page.tsx` — Sanity zones with photos; static ZONES as fallback
- `src/app/transformations/page.tsx` — Sanity transformations with photos; static array as fallback
- `src/app/about/page.tsx` — Sanity timeline + values; static arrays as fallback
- `sanity/schemas/siteSettings.ts` — added `timelineEvents`, `gymValues`, `faqs`
- `src/lib/sanity/queries.ts` — added `SITE_SETTINGS_ABOUT_QUERY`, `FAQS_QUERY`

### Build verification
- `npm run build` ✅ — 17 pages, exit code 0

### Git
- Commit `ac5af7f` pushed to `origin/main`

---

## [2026-03-08] — Fix: Trainer Profile Transformations

### Fixed
- `src/app/trainers/[slug]/page.tsx` — the transformations section was a hardcoded placeholder; it never queried Sanity. Replaced with a real fetch + before/after card grid.

### Added
- `TRANSFORMATIONS_BY_TRAINER_QUERY` in `src/lib/sanity/queries.ts` — fetches all transformations where `trainer._ref == $trainerId`
- Trainer profile page now renders before/after photo pairs, goal badge, weight change, duration, and testimonial quote for each linked client

### Files touched
- `src/app/trainers/[slug]/page.tsx`
- `src/lib/sanity/queries.ts`

### Build verification
- `npm run build` ✅ — 19 pages, exit code 0

### Git
- Commit `61ab89f` pushed to `origin/main`

---

## [2026-03-08] — Data: Facility Zones Seeded into Sanity

### Added
- Sanity documents created for all 4 facility zones:
  - `facility-strength-training` — Strength Training (order 1)
  - `facility-cardio-zone` — Cardio Zone (order 2)
  - `facility-crossfit-zone` — CrossFit Zone (order 3, was pre-existing from Studio)
  - `facility-functional-zone` — Functional Zone (order 4)
- All zones seeded with description, equipment list, and display order matching the previous static data
- `/facilities` page now fully Sanity-driven — static `STATIC_ZONES` fallback is no longer triggered

### Notes
- Seed script was run from project root (`seed-facilities.mjs`) then deleted (contained API token)
- Future zone updates: use Sanity Studio → Facility Zones

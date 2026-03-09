# CLAUDE.md — Sector 7 Gym Website

> This file is the instruction set for Claude Code. Read it at the start of every session before touching any code.

---

## Project Overview

**Sector 7** is a marketing and lead-capture website for a premium gym in Kochi, Kerala, India.

| Field | Value |
|---|---|
| **Framework** | Next.js 16.1.6 (App Router, Server Components by default) |
| **Language** | TypeScript — strict mode, zero `any` types |
| **Styling** | Tailwind CSS v4 + CSS custom properties |
| **Animations** | Framer Motion |
| **CMS** | Sanity.io (headless, GROQ, ISR revalidation via webhook) |
| **Forms** | React Hook Form + Zod |
| **Email** | Resend |
| **Deployment** | Vercel |
| **Package manager** | npm |
| **Primary goal** | Convert visitors into walk-ins, trial bookings, or app installs |

---

## Start of Every Session — Mandatory Steps

1. **Read `docs/CHANGELOG.md`** — understand every change made in every previous session before writing a single line of code.
2. **Read relevant doc files** for the area you are about to work on (see Documentation section below).
3. **Check the current build** passes: `npm run build` should exit 0 before and after your work.
4. **Update `docs/CHANGELOG.md`** at the end of every session with what you added, changed, and verified.

---

## Repository Location

```
/Users/sarathkumar/codes/sector7-website/sector7-website/
```

Git remote: `https://github.com/sarath6622/sector7-website.git`

---

## Documentation (always current — read before working in that area)

| File | When to read |
|---|---|
| `docs/CHANGELOG.md` | **Every session — mandatory** |
| `docs/architecture/ARCHITECTURE.md` | Folder structure, rendering strategy, data flow, env vars |
| `docs/architecture/api-routes.md` | API route contracts, request/response shapes, rate limiting |
| `docs/architecture/database-schema.md` | All Sanity schemas + GROQ query reference |
| `docs/guides/setup.md` | Local dev setup, commands |
| `docs/guides/deployment.md` | Vercel deploy steps, pre-launch checklist |
| `docs/ui-components/COMPONENTS.md` | Every component's props, behaviour, status |
| `docs/ui-components/design-system.md` | Colors, typography, spacing, animation presets |

---

## Phase Plan

Implement one phase per session. Mark complete in CHANGELOG when build passes.

| Phase | Scope | Status |
|---|---|---|
| 1 | Project init: CLAUDE.md, docs scaffold | ✅ Done |
| 2 | Next.js scaffold: globals.css, layout.tsx, types/, lib/, hooks/ | ✅ Done |
| 3 | *(merged into Phase 2)* | ✅ Done |
| 4 | Layout components: Navbar, Footer, WhatsAppFAB, MobileBottomCTA, PageTransition | ✅ Done |
| 5 | Shared UI components: Logo, Button, SectionHeading, AnimatedCounter, ScrollReveal, GrainOverlay, Skeleton, Modal | ✅ Done |
| 6 | Homepage sections: Hero, Highlights, FacilitiesPreview, TransformationPreview, TrainersPreview, GoogleReviews, LocationPreview, CTABanner | ✅ Done |
| 7 | All inner pages: /facilities, /trainers, /trainers/[slug], /transformations, /about, /blog, /blog/[slug], /pricing, /contact, /free-trial, /not-found, /error | ✅ Done |
| 8 | Sanity CMS: schemas, Studio embed (/studio), ISR revalidation webhook, all pages Sanity-first | ✅ Done |
| 9 | API routes wired: /api/contact, /api/trial, /api/newsletter — Resend email, rate limiting, honeypot | ✅ Done |
| 10 | SEO + Analytics: generateMetadata on all pages, JSON-LD schemas, GA4 + Clarity scripts, next-sitemap | ✅ Done |
| 11 | Content + real assets: swap placeholders for real gym photos, logo, OG image | ⏳ Pending |
| 12 | Performance audit: Lighthouse > 90 everywhere, LCP < 2s, CLS < 0.1 | ⏳ Pending |
| 13 | Pre-launch: cross-browser testing, mobile device testing, form smoke tests, DNS + Vercel deploy | ⏳ Pending |

---

## Brand & Design Rules

> **Note**: Accent color was changed from `#FF3A3A` → `#FF5500` in Phase 5. Use `#FF5500` in all new code. The `design-system.md` doc still shows the old value — ignore it, use `#FF5500`.

- **Accent**: `#FF5500` (brand orange)
- **Background primary**: `#0A0A0A`
- **Background secondary**: `#141414`
- **Surface (cards)**: `#1A1A1A`
- **Muted text**: `#6B6B6B`
- **Border**: `#2A2A2A`
- **WhatsApp green**: `#25D366`
- **Font — display/headings**: Bebas Neue (`font-display`)
- **Font — body**: DM Sans (`font-body`)
- **Font — stats/mono**: JetBrains Mono (`font-mono`)
- Typography is **UPPERCASE** for all display headings
- The brand name is written **SEC7OR** (with a 7) or **Sector 7** — never "Section 7" or "Sector7"

---

## Coding Conventions

### TypeScript
- Strict mode. Zero `any`. Use `unknown` + type narrowing if needed.
- Prefer interfaces over type aliases for object shapes.
- All component props must have explicit interface definitions.

### Components
- **Server Components by default** — only add `"use client"` when interactivity or browser APIs are genuinely required.
- Co-locate component interfaces in the same file.
- Never `import React from "react"` — not needed in React 19.
- Use `next/image` for all images. Always set `sizes` prop on fill images.
- Use `next/link` for all internal navigation.

### Styling
- Tailwind CSS utility classes only — no inline `style={{}}` except for dynamic values that cannot be expressed as utilities (e.g. dynamic `background` gradients).
- CSS custom properties defined in `globals.css` are available as Tailwind tokens (e.g. `bg-bg-primary`, `text-accent`, `border-border`).
- Class ordering: layout → sizing → spacing → typography → color → border → effects → transitions.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging.

### Forms
- All forms: React Hook Form + Zod schema validation.
- All public API routes: Zod server-side re-validation + honeypot check + rate limiting.
- Never trust client-side validation alone.

### Sanity
- All Sanity fetches are server-side (Server Components or API routes) — never expose `SANITY_API_TOKEN` to the client.
- Use `isSanityConfigured` guard before every `sanityClient.fetch()` call.
- Wrap every fetch in `try/catch` with silent fallthrough to static data.
- All ISR pages: `export const revalidate = 3600;`

### SEO
- Every page exports `metadata` using `generateMetadata()` from `src/lib/seo.ts` (static pages) or `async generateMetadata()` (dynamic pages).
- JSON-LD structured data rendered as `<script type="application/ld+json">` in page JSX — not in `<head>`.
- Canonical URLs must always be set.

### Analytics
- Never call `gtag()` directly. Use `trackEvent()` from `src/lib/analytics.ts`.
- Use the `GA_EVENTS` constants — never hardcode event name strings.

### WhatsApp
- Never hardcode WhatsApp URLs. Always use `buildWhatsAppURL()` from `src/lib/whatsapp.ts`.
- Use `WA_MESSAGES.*` constants for contextual prefilled messages.

---

## Key File Locations

```
src/lib/seo.ts                    generateMetadata(), generateJSONLD(), getLocalBusinessJSONLD()
src/lib/analytics.ts              trackEvent(), GA_EVENTS
src/lib/whatsapp.ts               buildWhatsAppURL(), WA_MESSAGES
src/lib/utils.ts                  cn(), formatDate()
src/lib/rateLimit.ts              checkRateLimit() — shared across all form API routes
src/lib/sanity/client.ts          sanityClient, urlFor(), isSanityConfigured
src/lib/sanity/queries.ts         All GROQ query constants
src/types/index.ts                All shared TypeScript interfaces
src/app/globals.css               CSS custom properties (design tokens) + Tailwind directives
```

---

## Environment Variables

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                        # Server-only — never NEXT_PUBLIC_

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX # Country code, no +

# Google
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_PLACE_ID=

# Site
NEXT_PUBLIC_SITE_URL=https://sector7gym.com
NEXT_PUBLIC_SITE_NAME=Sector 7

# Email
RESEND_API_KEY=
NOTIFICATION_EMAIL=info@sector7gym.com
FROM_EMAIL=Sector 7 <noreply@sector7gym.com>

# ISR Revalidation
SANITY_REVALIDATE_SECRET=
```

---

## Build & Dev Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build (also runs next-sitemap postbuild)
npm run start        # Serve production build locally
npm run lint         # ESLint check
```

Build must pass with **zero TypeScript errors** before ending any session.

---

## What NOT to Do

- Do not add `"use client"` to a component unless it truly needs interactivity or browser APIs.
- Do not use `any` type — ever.
- Do not hardcode phone numbers, WhatsApp numbers, or site URLs outside of environment variable lookups.
- Do not create new utility files for one-off operations. Extend existing lib files.
- Do not commit `.env.local` or any file containing real API keys.
- Do not skip updating `docs/CHANGELOG.md` at end of session.
- Do not use `console.log` in production code paths.
- Do not use `!` (non-null assertion) — use optional chaining and defaults instead.

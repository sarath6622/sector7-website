# Local Development Setup — Sector 7 Website

> Last updated: 2026-03-07

---

## Prerequisites

- Node.js 18+ (LTS)
- npm 9+
- A Sanity.io account (free tier works)
- A Resend account for email (free tier: 3,000 emails/month)

---

## 1. Clone / Open Project

The project lives at: `c:\Users\sarat\Desktop\Sector 7\sector7-website\`

```bash
cd "c:\Users\sarat\Desktop\Sector 7\sector7-website"
```

---

## 2. Install Dependencies

```bash
npm install
```

Dependencies installed:
- `framer-motion` — animations
- `react-hook-form` + `@hookform/resolvers` + `zod` — forms
- `next-sanity` + `@sanity/image-url` — CMS
- `next-sitemap` — sitemap generation
- `lucide-react` — icons

---

## 3. Environment Variables

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — from Sanity dashboard
- `SANITY_API_TOKEN` — create a "viewer" token in Sanity (server-only)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — Indian number with country code, no +
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — from Google Analytics
- `RESEND_API_KEY` — from Resend dashboard
- `SANITY_REVALIDATE_SECRET` — any random string (use `openssl rand -hex 32`)

---

## 4. Start Development Server

```bash
npm run dev
```

Opens at: http://localhost:3000

---

## 5. Start Sanity Studio (CMS)

```bash
cd sanity
npx sanity dev
```

Opens Sanity Studio at: http://localhost:3333

First time: run `npx sanity deploy` to deploy the studio to Sanity's CDN.

---

## 6. Common Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build (verify zero TS errors)
npm run start        # Start production build locally
npm run lint         # ESLint check
npx next-sitemap     # Regenerate sitemap (run after adding pages)
```

---

## 7. Project Structure Quick Reference

See `docs/architecture/ARCHITECTURE.md` for the full folder structure.

Key locations:
- Pages: `src/app/`
- Components: `src/components/`
- Global styles + CSS vars: `src/styles/globals.css`
- Design tokens: `tailwind.config.ts`
- Sanity queries: `src/lib/sanity/queries.ts`
- TypeScript types: `src/types/index.ts`

---

## 8. Font Files

Self-hosted fonts go in `public/fonts/`. Required files:
- `BebâsNeue-Regular.woff2`
- `DMSans-Regular.woff2`, `DMSans-Medium.woff2`, `DMSans-SemiBold.woff2`
- `JetBrainsMono-Regular.woff2`

Download from Google Fonts (locally) or use `fontsource` as an alternative.

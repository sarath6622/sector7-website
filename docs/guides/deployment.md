# Deployment Guide — Sector 7 Website

> Last updated: 2026-03-07
> Deployment target: Vercel

---

## Pre-deployment Checklist

### Code Quality
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] `npm run lint` passes with zero errors
- [ ] No `console.log` statements in production code
- [ ] All `TODO` comments resolved

### Content
- [ ] Gym logo (SVG) added to `public/images/logo.svg`
- [ ] Favicon added to `public/favicon.ico` + `public/apple-touch-icon.png`
- [ ] OG image (1200×630px) added to `public/images/og-image.jpg`
- [ ] Robots.txt correct at `public/robots.txt`
- [ ] Sitemap generated: `npx next-sitemap`

### Forms & API
- [ ] Contact form submits correctly and gym receives email
- [ ] Trial form submits correctly
- [ ] Rate limiting tested (block after 3 submissions)
- [ ] WhatsApp links open correctly on mobile + desktop

### SEO
- [ ] Every page has unique `<title>` and `<meta description>`
- [ ] All JSON-LD schemas valid (test at schema.org validator)
- [ ] Sitemap submitted to Google Search Console
- [ ] robots.txt accessible at `/robots.txt`

### Analytics
- [ ] GA4 events firing (use GA4 DebugView)
- [ ] Microsoft Clarity tracking ID installed
- [ ] `whatsapp_click` event tracked with correct `source` values

### Performance (Lighthouse, run on production URL)
- [ ] Performance > 90
- [ ] SEO > 95
- [ ] Accessibility > 90
- [ ] All images have alt text
- [ ] LCP < 2.0s
- [ ] CLS < 0.1

### Mobile
- [ ] Tested on real iOS Safari (iPhone)
- [ ] Tested on real Android Chrome
- [ ] No horizontal scroll on any page
- [ ] MobileBottomCTA visible and functional
- [ ] WhatsApp FAB correctly positioned (not overlapping bottom CTA)
- [ ] Tap targets minimum 48×48px

### Cross-browser
- [ ] Chrome ✓
- [ ] Safari ✓
- [ ] Firefox ✓
- [ ] Edge ✓

### Sanity
- [ ] All content entered in Sanity CMS
- [ ] Sanity webhook configured for ISR revalidation
- [ ] Sanity Studio deployed (`npx sanity deploy`)

---

## Vercel Deployment Steps

### 1. Connect Repository
- Push code to GitHub (create repo first)
- Connect repo in Vercel dashboard
- Framework: Next.js (auto-detected)

### 2. Environment Variables
Set all variables from `.env.local` in Vercel:
- Project Settings → Environment Variables
- Set for "Production" environment (and "Preview" if needed)

### 3. Build Settings
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`

### 4. Custom Domain
- Add `sector7gym.com` in Vercel Domains settings
- Update DNS records at domain registrar:
  - A record: `76.76.21.21`
  - CNAME: `www` → `cname.vercel-dns.com`

### 5. Enable Vercel Features
- Vercel Analytics (Web Vitals)
- Vercel Speed Insights
- Edge Network (enabled by default)

---

## Sanity Webhook Setup

In Sanity dashboard → API → Webhooks:
- URL: `https://sector7gym.com/api/revalidate`
- Trigger on: Create, Update, Delete
- Filter: all document types
- Header: `X-Sanity-Webhook-Secret: {SANITY_REVALIDATE_SECRET}`
- HTTP method: POST

---

## Post-Launch Monitoring

| Tool | Check frequency | What to check |
|---|---|---|
| Google Search Console | Weekly | Indexing errors, search performance |
| Google Analytics | Weekly | Traffic, conversion events, WhatsApp clicks |
| Microsoft Clarity | Weekly | Heatmaps, rage clicks, session recordings |
| Vercel Dashboard | Weekly | Build times, function errors, bandwidth |
| UptimeRobot (free) | Continuous | Site uptime alerts |

---

## Rollback

If a deployment breaks the site:
1. Vercel Dashboard → Deployments → click previous deployment → "Promote to Production"
2. This instantly reverts with zero downtime

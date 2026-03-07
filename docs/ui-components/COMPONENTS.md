# UI Components — Sector 7 Gym Website

> All reusable components documented here. Update this file whenever a component is added, modified, or removed.
> Last updated: 2026-03-07 (Phase 7 complete)
> Status: ⏳ = planned, ✅ = built

---

## Layout Components (`src/components/layout/`)

### Navbar ✅
- Sticky, scroll-aware (adds backdrop blur on scroll)
- Desktop: horizontal link list + CTA button ("Book Trial")
- Mobile: hamburger icon → full-screen overlay menu
- Links: Home, Facilities, Trainers, Transformations, About, Blog, Pricing, Contact
- Reduces to logo-only on `/free-trial` page

### Footer ✅
- 3-column layout (desktop), stacked (mobile)
- Col 1: Logo + tagline + social links
- Col 2: Quick links
- Col 3: Contact info (address, phone, email, hours summary)
- Bottom bar: copyright + "No stock photo energy"

### WhatsAppFAB ✅
- Position: `fixed bottom-6 right-6`, `z-50`
- Size: 56px (mobile) / 60px (desktop) circle
- Color: `#25D366`
- Appears after 3 seconds (avoid CLS)
- Pulse every 30 seconds
- Hover: expands to show "Chat with us" label
- Smart messaging: reads sessionStorage for last viewed page context
- Hides/repositions when MobileBottomCTA is visible
- GA4 event: `whatsapp_click` with `source` param

### MobileBottomCTA ✅
- Mobile only (`< 768px`)
- Fixed bottom bar, 64px height
- Appears after scrolling past hero section
- Two buttons: "Book Trial" (primary) + WhatsApp icon (secondary)
- `z-50`, backdrop blur

### PageTransition ✅
- Framer Motion `AnimatePresence` wrapper
- Fade in/out between page navigations

---

## Shared UI Components (`src/components/ui/`)

### Logo ✅
**Props**:
```typescript
interface LogoProps {
  variant?: 'compact' | 'full';  // compact for Navbar, full for hero/footer
  theme?: 'dark' | 'light';      // dark = white text, light = black text
  className?: string;
}
```
- Recreates the official SEC7OR FITNESS brand identity
- `compact`: inline `SEC [large orange 7] OR` for Navbar
- `full`: stacked with FITNESS label + GYM CROSSFIT tagline
- Brand orange `#FF5500` hardcoded (bypasses theming)

### Button ✅
**Props**:
```typescript
// Renders as <button> when no href; as Next.js <Link> when href provided
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp';
type ButtonSize    = 'sm' | 'md' | 'lg';
// Discriminated union: ButtonAsButton | ButtonAsLink
```
- `primary`: orange bg + glow (`accent-glow` class)
- `secondary`: transparent + white border, white-fill on hover
- `ghost`: transparent + orange border, orange-fill on hover
- `whatsapp`: green (`#25D366`) background
- External links: add `external` prop → `target="_blank" rel="noopener noreferrer"`
- **Usage**: `<Button variant="primary" href="/free-trial">Book Free Trial</Button>`

### SectionHeading ✅
**Props**:
```typescript
interface SectionHeadingProps {
  label?: string;          // small accent-colored chip above heading
  heading: string;         // wrap words in <em> for orange accent
  subtitle?: string;       // muted body text below
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}
```
- Words wrapped in `<em>` tags render in `#FF5500`
- Always includes accent underline bar (16px, orange)
- **Usage**: `<SectionHeading label="Our Team" heading="Meet the <em>Trainers</em>" align="center" />`

### AnimatedCounter ✅
**Props**:
```typescript
interface AnimatedCounterProps {
  value: number;           // target number
  suffix?: string;         // e.g. '+', '%', 'kg'
  prefix?: string;         // e.g. '#', '$'
  label: string;           // text below the number
  duration?: number;       // ms, default 1800
  className?: string;
}
```
- IntersectionObserver (threshold 0.5) triggers count-up
- easeOutQuart animation via requestAnimationFrame
- JetBrains Mono font, white color
- Respects `prefers-reduced-motion` (shows final value instantly)

### ScrollReveal ✅
**Props**:
```typescript
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;           // seconds, default 0
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;        // px, default 24
  duration?: number;        // seconds, default 0.6
  threshold?: number;       // 0–1, default 0.15
  once?: boolean;           // default true
  className?: string;
}
```
- Framer Motion fade+slide on IntersectionObserver trigger
- Renders plain `<div>` (no animation) when `prefers-reduced-motion`

### GrainOverlay ✅
**Props**:
```typescript
interface GrainOverlayProps {
  opacity?: number;         // 0–1, default 0.04
  className?: string;
}
```
- SVG `feTurbulence` noise encoded inline as data URI (no file dependency)
- `position: absolute; inset: 0; pointer-events: none; z-index: 1`
- `mixBlendMode: 'overlay'`
- **Usage**: First child of a `relative overflow-hidden` container

### Skeleton ✅
**Props**:
```typescript
interface SkeletonProps {
  variant?: 'rect' | 'circle' | 'text';
  lines?: number;           // text variant only, default 3
  className?: string;
}
```
- Shimmer via CSS `@keyframes shimmer` (translate-x 100%)
- `rect`: rectangular block; `circle`: round; `text`: stacked lines (last line 75% wide)

### Modal ✅
**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';  // default 'md'
  children: React.ReactNode;
  className?: string;
}
```
- React portal to `document.body`
- Focus trap on open, Escape-to-close, scroll-lock
- `aria-modal="true"`, `role="dialog"`, `aria-labelledby` when title present
- Framer Motion backdrop (opacity) + panel (opacity+scale) animations
- Respects `prefers-reduced-motion`

---

## Homepage Components (`src/components/home/`)

### Hero ✅
- Full viewport height (`100dvh` desktop, auto mobile)
- Background: CSS radial-gradient placeholder (swap for gym photo in Phase 8)
- Content: label chip, display heading, subtitle, 3 CTAs, trust strip, scroll indicator
- Framer Motion stagger with `[number, number, number, number]` typed ease tuple
- `prefers-reduced-motion` safe

### Highlights ✅
- 4 AnimatedCounter stats: 50+ Equipment, 12+ Trainers, 3000+ Transformations, 5+ Years
- Server Component strip with dark-bg section

### FacilitiesPreview ✅
- Bento grid (4 zones: Strength, Cardio, CrossFit, Functional)
- First + last cards `lg:col-span-2` for asymmetric layout
- CSS gradient placeholders per zone, ScrollReveal stagger

### TrainersPreview ✅ — **Updated 2026-03-07**
- **Server Component** — data passed from homepage as props (replaced internal static array)
- Props: `trainers: TrainerPreviewItem[]`
- Shows real Sanity trainer photos; gradient placeholder if no photo
- Returns `null` if `trainers` is empty (section hides on homepage)
- `TrainerPreviewItem`: `{ _id, name, slug, title, specializations, experience, photo? }`

### TransformationPreview ✅ — **Updated 2026-03-07**
- **Client Component** (scroll interactivity) — data passed from homepage as props
- Props: `items: TransformationPreviewItem[]`
- Shows real Sanity after-photos; gradient placeholders otherwise
- Returns `null` if `items` is empty
- `TransformationPreviewItem`: `{ _id, clientName, goal, durationMonths, weightChange?, changeLabel?, afterImageUrl? }`

### GoogleReviews ✅
- Aggregate 4.8★ rating display
- 3 hardcoded review cards (Google My Business link placeholder)

### LocationPreview ✅
- Client Component (today's-day highlighting uses `getTodayDayName()`)
- Real Google Maps iframe (src from Google My Business)
- 7-day hours table, today highlighted in accent color

### CTABanner ✅
- Server Component, full-width `#FF5500` accent background
- GrainOverlay texture, decorative background wordmark
- Two white-border secondary CTAs

---

## Page-specific Components

### PageHero ✅ (`src/components/ui/PageHero.tsx`)
**Props**:
```typescript
interface PageHeroProps {
  label?: string;    // small accent chip above heading
  heading: string;   // supports <em> for accent words
  subtitle?: string;
}
```
- Used on all inner pages as the top section
- GrainOverlay texture on dark bg secondary
- `pt-32 md:pt-40` for sticky Navbar clearance
- Heading rendered via `dangerouslySetInnerHTML` to parse `<em>` → accent color

### FAQAccordion ✅ (`src/components/pricing/FAQAccordion.tsx`)
```typescript
interface FAQItem { question: string; answer: string; }
interface FAQAccordionProps { items: FAQItem[]; }
```
- Client Component, single-open (closes others when opening new)
- Framer Motion `AnimatePresence` + `animate={{ height }}` transition
- `aria-expanded`, `aria-controls` accessible
- Plus/minus icon toggle

### FreeTrialForm ✅ (`src/components/forms/FreeTrialForm.tsx`)
- Client Component, RHF + Zod
- Fields: name*, phone*, email*, preferredDate* (min: today), timeSlot* (enum), goal* (enum), referral, honeypot `_hp`
- Simulated 800ms network + success screen (Phase 9: wire to `/api/trial`)
- Accessible error messages below each field

### ContactForm ✅ (`src/components/forms/ContactForm.tsx`)
- Client Component, RHF + Zod
- Fields: name*, phone*, email, enquiryType* (enum), message* (min 10 chars), honeypot `_hp`
- Simulated 800ms network + success screen (Phase 9: wire to `/api/contact`)

### NewsletterForm ⏳ (`src/components/forms/NewsletterForm.tsx`)
- Fields: Email, Honeypot (hidden)
- Submits to `/api/newsletter`

---

## Pricing Components (`src/components/pricing/`)

See FAQAccordion above.

---

## Blog Components (inline in page files — Phase 8: move to Sanity Portable Text)

- Blog listing: `src/app/blog/page.tsx` — `BLOG_POSTS` array, featured card + 2-col grid
- Blog post: `src/app/blog/[slug]/page.tsx` — `POST_CONTENT` with typed `sections[]`

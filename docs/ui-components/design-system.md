# Design System — Sector 7 Gym Website

> Last updated: 2026-03-07
> Source of truth for all design tokens. These values are defined as CSS custom properties in `src/styles/globals.css` and extended in `tailwind.config.ts`.

---

## Color Tokens

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| Background Primary | `--bg-primary` | `#0A0A0A` | Page background, hero |
| Background Secondary | `--bg-secondary` | `#141414` | Alternating sections |
| Surface | `--surface` | `#1A1A1A` | Cards, modals, form backgrounds |
| Accent (Red) | `--accent` | `#FF3A3A` | CTAs, highlights, hover states, glow |
| White | `--white` | `#FFFFFF` | Primary text, headings |
| Muted | `--muted` | `#6B6B6B` | Secondary text, labels, placeholders |
| Border | `--border` | `#2A2A2A` | Dividers, card borders, input borders |
| WhatsApp Green | `--whatsapp` | `#25D366` | WhatsApp FAB only |

### Accent glow effect
```css
box-shadow: 0 0 20px rgba(255, 58, 58, 0.3);  /* Use on accent-colored elements */
```

### Dark overlay for images
```css
background: linear-gradient(to bottom, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.85) 100%);
```

---

## Typography

### Font Families

| Font | Usage | Source |
|---|---|---|
| **Bebas Neue** | Display/Headings (`font-display`) | Self-hosted, `public/fonts/` |
| **DM Sans** | Body text (`font-body`) | Self-hosted, `public/fonts/` |
| **JetBrains Mono** | Stats/Numbers/Code (`font-mono`) | Self-hosted, `public/fonts/` |

### Type Scale

| Element | Size | Weight | Font | Notes |
|---|---|---|---|---|
| Hero heading | `clamp(3rem, 8vw, 8rem)` | 400 (Bebas) | display | All-caps, leading-none |
| Page heading (H1) | `clamp(2.5rem, 5vw, 5rem)` | 400 (Bebas) | display | — |
| Section heading (H2) | `clamp(2rem, 4vw, 3.5rem)` | 400 (Bebas) | display | — |
| Sub-heading (H3) | `clamp(1.5rem, 2.5vw, 2rem)` | 600 | body | DM Sans SemiBold |
| Body large | `1.125rem` (18px) | 400 | body | — |
| Body | `1rem` (16px) | 400 | body | Minimum for mobile |
| Small / Label | `0.875rem` (14px) | 400–500 | body | Never below 14px |
| Stat numbers | `clamp(2.5rem, 5vw, 4.5rem)` | 400 | mono | Animated counter |
| Caption | `0.75rem` (12px) | 400 | body | Image captions only |

### Tailwind class shorthands (custom)
- `font-display` → Bebas Neue
- `font-body` → DM Sans
- `font-mono` → JetBrains Mono (overrides Tailwind default)

---

## Spacing

| Name | Value | Usage |
|---|---|---|
| Section padding (desktop) | `py-32` (128px) | Between all major sections |
| Section padding (mobile) | `py-20` (80px) | Mobile override |
| Container max-width | `max-w-7xl` (1280px) | Page content wrapper |
| Container padding | `px-4 md:px-8 lg:px-16` | Horizontal gutters |
| Card padding | `p-6 md:p-8` | Card components |
| Grid gap | `gap-6 md:gap-8` | Component grids |

---

## Breakpoints (Tailwind defaults)

| Name | Width | Context |
|---|---|---|
| `sm` | 640px | Large phones landscape |
| `md` | 768px | Tablets — also triggers mobile-specific UX changes |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

Mobile-first: style for mobile first, use `md:`, `lg:`, `xl:` to add desktop styles.

---

## Animation Presets (Framer Motion)

### Scroll reveal (standard)
```typescript
const fadeInUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
```

### Staggered children
```typescript
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
```

### Page transition
```typescript
const pageVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};
```

### Reduced motion rule
Always wrap Framer Motion components with:
```typescript
const prefersReducedMotion = useReducedMotion();
// Skip all animations if true
```

---

## Visual Effects

### Grain overlay
Applied to hero sections via `<GrainOverlay />` component (SVG feTurbulence filter).
Opacity: 5–8%. Position: absolute, inset-0, pointer-events-none.

### Scanline / grid pattern (optional)
```css
background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
background-size: 50px 50px;
```

### Hover states (cards with images)
```css
/* Image zoom */
img { transition: transform 0.4s ease; }
.card:hover img { transform: scale(1.05); }
/* Overlay fade */
.overlay { transition: opacity 0.3s ease; }
.card:hover .overlay { opacity: 0.6; } /* lighten */
```

---

## Focus Ring (Accessibility)

All interactive elements use a custom focus ring (not browser default):
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

## Z-Index Scale

| Element | z-index |
|---|---|
| Modals / Overlays | 100 |
| Mobile nav overlay | 80 |
| Navbar (sticky) | 60 |
| WhatsApp FAB | 50 |
| Mobile bottom CTA | 50 |
| Dropdowns / Tooltips | 40 |
| Page content | 0 |

---

## Component-Level Design Decisions

### Button variants
| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| primary | `#FF3A3A` | `#FFFFFF` | none | darken 10%, glow |
| secondary | transparent | `#FFFFFF` | `2px solid #FFFFFF` | bg `#FFFFFF`, text `#0A0A0A` |
| ghost | transparent | `#FF3A3A` | `2px solid #FF3A3A` | bg `#FF3A3A`, text `#FFFFFF` |
| whatsapp | `#25D366` | `#FFFFFF` | none | darken |

### Card style (standard)
```
background: var(--surface)      /* #1A1A1A */
border: 1px solid var(--border) /* #2A2A2A */
border-radius: 8px
overflow: hidden
```

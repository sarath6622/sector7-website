# API Routes — Sector 7 Website

> All server-side API routes. Built as Next.js Route Handlers in `src/app/api/`.
> Last updated: 2026-03-07

---

## POST `/api/contact`

**File**: `src/app/api/contact/route.ts`

**Purpose**: Handle contact form submissions. Validate, sanitize, send email notification to gym + auto-reply to user.

**Request body** (validated with Zod):
```typescript
{
  name: string;           // required, min 2 chars
  phone: string;          // required, Indian format: 10 digits starting with 6-9
  email?: string;         // optional
  enquiryType: 'General' | 'Membership' | 'Personal Training' | 'Corporate' | 'Other';
  message: string;        // required, min 10 chars, max 500 chars
  honeypot?: string;      // must be empty (bot trap)
}
```

**Response**:
- `200 { success: true, message: "..." }` — submission accepted
- `400 { success: false, errors: ZodError[] }` — validation failed
- `429 { success: false, message: "Too many requests" }` — rate limited
- `500 { success: false, message: "Server error" }` — internal error

**Rate limiting**: 3 requests per IP per hour (in-memory store, resets on cold start)

**Side effects**:
- Sends email to `NOTIFICATION_EMAIL` via Resend with form data
- Optionally sends auto-reply to user email if provided

---

## POST `/api/trial`

**File**: `src/app/api/trial/route.ts`

**Purpose**: Handle free trial booking form submissions.

**Request body** (validated with Zod):
```typescript
{
  name: string;           // required
  phone: string;          // required, Indian format
  email: string;          // required for trial (confirmation)
  preferredDate: string;  // required, ISO date string, must be >= tomorrow
  preferredTime: 'Morning (6AM–10AM)' | 'Afternoon (12PM–4PM)' | 'Evening (5PM–9PM)';
  fitnessGoal: 'Weight Loss' | 'Muscle Gain' | 'General Fitness' | 'Strength' | 'Other';
  referralSource: 'Google' | 'Instagram' | 'Friend/Family' | 'Walk-in' | 'Other';
  honeypot?: string;      // must be empty
}
```

**Response**: Same pattern as `/api/contact`

**Side effects**:
- Sends notification email to gym staff with booking details
- Sends confirmation email to user with trial details + WhatsApp link

---

## POST `/api/newsletter`

**File**: `src/app/api/newsletter/route.ts`

**Purpose**: Newsletter signup.

**Request body**:
```typescript
{
  email: string;    // required, valid email
  honeypot?: string;
}
```

**Response**: `200 | 400 | 429`

**Side effects**: Add to email list (Resend audience or similar)

---

## POST `/api/revalidate`

**File**: `src/app/api/revalidate/route.ts`

**Purpose**: Sanity webhook endpoint to trigger ISR revalidation when content changes in the CMS.

**Security**: Validates `SANITY_REVALIDATE_SECRET` header before revalidating.

**Request body** (from Sanity webhook):
```typescript
{
  _type: string;   // Sanity document type that changed
  slug?: { current: string };
}
```

**Logic**:
- `trainer` → revalidate `/trainers` + `/trainers/[slug]`
- `transformation` → revalidate `/transformations`
- `blogPost` → revalidate `/blog` + `/blog/[slug]`
- `facility` → revalidate `/facilities`
- `pricingPlan` → revalidate `/pricing`
- `siteSettings` → revalidate all pages (root layout data)

**Response**: `200 { revalidated: true, paths: string[] }` or `401 | 500`

---

## Rate Limiting Implementation

All form routes share a simple in-memory rate limiter:

```typescript
// Pattern: Map<ip, { count: number; resetAt: number }>
const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
```

For production, consider upgrading to Vercel KV (Redis) for persistence across function instances.

# Database Schema — Sanity CMS

> All schema definitions for the Sector 7 Sanity CMS.
> Last updated: 2026-03-07
> Schema files live in `sector7-website/sanity/schemas/`

---

## Trainer (`sanity/schemas/trainer.ts`)

```typescript
{
  name: 'trainer',
  title: 'Trainer',
  type: 'document',
  fields: [
    { name: 'name',            type: 'string',    validation: required },
    { name: 'slug',            type: 'slug',      source: 'name' },
    { name: 'photo',           type: 'image',     options: { hotspot: true } },
    { name: 'specializations', type: 'array',     of: [{ type: 'string' }] },
    { name: 'certifications',  type: 'array',     of: [{ type: 'string' }] },
    { name: 'yearsExperience', type: 'number' },
    { name: 'philosophy',      type: 'text' },
    { name: 'bio',             type: 'blockContent' },   // Rich text (Portable Text)
    { name: 'instagramUrl',    type: 'url' },
    { name: 'order',           type: 'number' },          // Display order
    { name: 'isActive',        type: 'boolean',   initialValue: true },
  ]
}
```

**Used in**: `/trainers` listing, `/trainers/[slug]` profiles, Transformations page (trainer reference)

---

## Transformation (`sanity/schemas/transformation.ts`)

```typescript
{
  name: 'transformation',
  title: 'Transformation',
  type: 'document',
  fields: [
    { name: 'clientName',    type: 'string' },              // First name only (privacy)
    { name: 'beforeImage',   type: 'image' },
    { name: 'afterImage',    type: 'image' },
    { name: 'durationWeeks', type: 'number' },
    { name: 'weightChange',  type: 'number' },              // Negative = weight loss
    { name: 'goal',          type: 'string', options: {
        list: ['Weight Loss', 'Muscle Gain', 'Recomposition']
    }},
    { name: 'testimonial',   type: 'text' },
    { name: 'trainer',       type: 'reference', to: [{ type: 'trainer' }] },
    { name: 'videoUrl',      type: 'url' },
    { name: 'date',          type: 'date' },
    { name: 'isFeatured',    type: 'boolean' },
  ]
}
```

**Used in**: `/transformations` page, homepage `TransformationPreview` carousel

---

## Blog Post (`sanity/schemas/blogPost.ts`)

```typescript
{
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title',         type: 'string',    validation: required },
    { name: 'slug',          type: 'slug',      source: 'title' },
    { name: 'featuredImage', type: 'image',     options: { hotspot: true } },
    { name: 'excerpt',       type: 'text',      rows: 3 },
    { name: 'category',      type: 'string',    options: {
        list: ['Workout', 'Nutrition', 'Recovery', 'Lifestyle']
    }},
    { name: 'body',          type: 'blockContent' },          // Portable Text
    { name: 'author',        type: 'reference', to: [{ type: 'trainer' }] },
    { name: 'publishedAt',   type: 'datetime' },
    { name: 'readTime',      type: 'number' },                 // Minutes
    { name: 'seoTitle',      type: 'string' },
    { name: 'seoDescription',type: 'text' },
    { name: 'relatedPosts',  type: 'array',
        of: [{ type: 'reference', to: [{ type: 'blogPost' }] }]
    },
  ]
}
```

**Used in**: `/blog` listing, `/blog/[slug]` posts

---

## Facility (`sanity/schemas/facility.ts`)

```typescript
{
  name: 'facility',
  title: 'Facility',
  type: 'document',
  fields: [
    { name: 'name',            type: 'string' },
    { name: 'slug',            type: 'slug',   source: 'name' },
    { name: 'description',     type: 'text' },
    { name: 'images',          type: 'array',  of: [{ type: 'image', options: { hotspot: true } }] },
    { name: 'equipmentBrands', type: 'array',  of: [{ type: 'string' }] },
    { name: 'order',           type: 'number' },
  ]
}
```

**Zones**: Strength Zone, Cardio Section, Functional Training Area, Recovery & Wellness, Locker Rooms, Parking & Access

**Used in**: `/facilities` page, homepage `FacilitiesPreview`

---

## Pricing Plan (`sanity/schemas/pricingPlan.ts`)

```typescript
{
  name: 'pricingPlan',
  title: 'Pricing Plan',
  type: 'document',
  fields: [
    { name: 'name',           type: 'string' },
    { name: 'monthlyPrice',   type: 'number' },
    { name: 'quarterlyPrice', type: 'number' },
    { name: 'annualPrice',    type: 'number' },
    { name: 'features',       type: 'array', of: [{ type: 'string' }] },
    { name: 'isPopular',      type: 'boolean' },
    { name: 'order',          type: 'number' },
  ]
}
```

**Used in**: `/pricing` page

---

## Testimonial (`sanity/schemas/testimonial.ts`)

```typescript
{
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    { name: 'reviewerName',   type: 'string' },
    { name: 'rating',         type: 'number', validation: min(1).max(5) },
    { name: 'excerpt',        type: 'text',   rows: 3 },
    { name: 'source',         type: 'string', options: { list: ['Google', 'Direct'] } },
    { name: 'isFeatured',     type: 'boolean' },
    { name: 'date',           type: 'date' },
  ]
}
```

**Used in**: Homepage `GoogleReviews` section

---

## Site Settings — Singleton (`sanity/schemas/siteSettings.ts`)

```typescript
{
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // __experimental_actions: ['update', 'publish'] — singleton (no create/delete)
  fields: [
    { name: 'gymName',       type: 'string' },
    { name: 'tagline',       type: 'string' },
    { name: 'phone',         type: 'string' },
    { name: 'email',         type: 'string' },
    { name: 'whatsappNumber',type: 'string' },
    { name: 'address',       type: 'text' },
    { name: 'googleMapsUrl', type: 'url' },
    { name: 'googlePlaceId', type: 'string' },
    { name: 'operatingHours',type: 'array', of: [{
        type: 'object',
        fields: [
          { name: 'day',   type: 'string' },
          { name: 'open',  type: 'string' },
          { name: 'close', type: 'string' },
        ]
    }]},
    { name: 'socialLinks',   type: 'object', fields: [
      { name: 'instagram',   type: 'url' },
      { name: 'facebook',    type: 'url' },
      { name: 'youtube',     type: 'url' },
    ]},
    { name: 'logo',          type: 'image' },
    { name: 'ogImage',       type: 'image' },
  ]
}
```

**Used in**: Root layout (global settings, contact info, social links)

### New fields added 2026-03-07 (CMS Migration)

| Field | Type | Used on |
|---|---|---|
| `timelineEvents` | `{ year, title, description }[]` | `/about` — timeline section |
| `gymValues` | `{ title, description }[]` | `/about` — core values section |
| `faqs` | `{ question, answer }[]` | `/pricing` — FAQ accordion |

---

## BlockContent (`sanity/schemas/blockContent.ts`)

Shared Portable Text definition used by Trainer.bio and BlogPost.body:
- standard blocks (h2, h3, h4, normal, blockquote)
- marks: strong, em, code, link
- custom types: image (with caption), callout box

---

## GROQ Queries Reference (`src/lib/sanity/queries.ts`)

| Export | Fetches |
|---|---|
| `SITE_SETTINGS_QUERY` | Full siteSettings document |
| `SITE_SETTINGS_ABOUT_QUERY` | `timelineEvents` + `gymValues` |
| `FAQS_QUERY` | `faqs` array from siteSettings |
| `ALL_TRAINERS_QUERY` | All active trainers ordered by `order` |
| `TRAINER_BY_SLUG_QUERY` | Single trainer by slug |
| `TRAINER_SLUGS_QUERY` | All trainer slugs (generateStaticParams) |
| `ALL_BLOG_POSTS_QUERY` | All posts, newest first |
| `BLOG_POST_BY_SLUG_QUERY` | Single post with author + relatedPosts |
| `BLOG_SLUGS_QUERY` | All post slugs |
| `ALL_TRANSFORMATIONS_QUERY` | All transformations |
| `FEATURED_TRANSFORMATIONS_QUERY` | Transformations where `featured == true` |
| `ALL_FACILITIES_QUERY` | All facilities ordered by `order` |
| `ALL_PRICING_PLANS_QUERY` | All pricing plans ordered by `order` |

/**
 * All GROQ queries for Sanity CMS.
 * Slugs are flattened to strings ("slug": slug.current) for direct use in pages.
 */

// ─── Site Settings ────────────────────────────────────────────────────────────
export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    gymName, tagline, phone, email, whatsappNumber,
    address, googleMapsEmbedSrc, googlePlaceId,
    operatingHours, socialLinks, ogImage
  }
`;

export const SITE_SETTINGS_ABOUT_QUERY = `
  *[_type == "siteSettings"][0] {
    timelineEvents,
    gymValues
  }
`;

export const FAQS_QUERY = `
  *[_type == "siteSettings"][0] {
    faqs
  }
`;

// ─── Trainers ─────────────────────────────────────────────────────────────────
export const ALL_TRAINERS_QUERY = `
  *[_type == "trainer" && isActive == true] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    photo,
    title,
    specializations,
    certifications,
    "experience": yearsExperience,
    bio,
    order
  }
`;

export const TRAINER_BY_SLUG_QUERY = `
  *[_type == "trainer" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo,
    title,
    specializations,
    certifications,
    "experience": yearsExperience,
    bio,
    fullBio,
    instagramUrl,
    isActive
  }
`;

export const TRAINER_SLUGS_QUERY = `
  *[_type == "trainer" && isActive == true] { "slug": slug.current }
`;

// ─── Transformations ──────────────────────────────────────────────────────────
export const ALL_TRANSFORMATIONS_QUERY = `
  *[_type == "transformation"] | order(date desc) {
    _id,
    clientName,
    beforeImage,
    afterImage,
    durationMonths,
    weightChange,
    changeLabel,
    goal,
    testimonial,
    "trainerName": trainer->name,
    isFeatured
  }
`;

export const FEATURED_TRANSFORMATIONS_QUERY = `
  *[_type == "transformation" && isFeatured == true] | order(date desc)[0...5] {
    _id,
    clientName,
    beforeImage,
    afterImage,
    durationMonths,
    weightChange,
    changeLabel,
    goal,
    testimonial,
    "trainerName": trainer->name
  }
`;

export const TRANSFORMATIONS_BY_TRAINER_QUERY = `
  *[_type == "transformation" && trainer._ref == $trainerId] | order(date desc) {
    _id,
    clientName,
    beforeImage,
    afterImage,
    durationMonths,
    weightChange,
    changeLabel,
    goal,
    testimonial
  }
`;

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export const ALL_BLOG_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    featuredImage,
    excerpt,
    category,
    publishedAt,
    readTime,
    "authorName": author->name,
    "authorSlug": author->slug.current
  }
`;

export const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    featuredImage,
    excerpt,
    category,
    body,
    publishedAt,
    readTime,
    seoTitle,
    seoDescription,
    "authorName":  author->name,
    "authorSlug":  author->slug.current,
    "authorTitle": author->title,
    "authorBio":   author->bio,
    "authorPhoto": author->photo,
    "relatedPosts": relatedPosts[]->{ _id, title, "slug": slug.current, featuredImage, category, publishedAt }
  }
`;

export const BLOG_SLUGS_QUERY = `
  *[_type == "blogPost"] { "slug": slug.current }
`;

// ─── Facilities ───────────────────────────────────────────────────────────────
export const ALL_FACILITIES_QUERY = `
  *[_type == "facility"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    images,
    equipmentList,
    equipmentBrands,
    order
  }
`;

// ─── Pricing Plans ────────────────────────────────────────────────────────────
export const ALL_PRICING_PLANS_QUERY = `
  *[_type == "pricingPlan"] | order(order asc) {
    _id,
    name,
    description,
    monthlyPrice,
    quarterlyPrice,
    annualPrice,
    features,
    notIncluded,
    badge,
    isHighlighted,
    order
  }
`;

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const FEATURED_TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && isFeatured == true] | order(date desc)[0...3] {
    _id,
    reviewerName,
    rating,
    excerpt,
    source,
    date
  }
`;

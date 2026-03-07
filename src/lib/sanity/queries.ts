/**
 * All GROQ queries for Sanity CMS.
 * Import the relevant query and pass it to sanityClient.fetch().
 */

// ─── Site Settings ────────────────────────────────────────────────────────────
export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    gymName, tagline, phone, email, whatsappNumber,
    address, googleMapsUrl, googlePlaceId,
    operatingHours, socialLinks, logo, ogImage
  }
`;

// ─── Trainers ─────────────────────────────────────────────────────────────────
export const ALL_TRAINERS_QUERY = `
  *[_type == "trainer" && isActive == true] | order(order asc) {
    _id, name, slug, photo, specializations,
    certifications, yearsExperience, order
  }
`;

export const TRAINER_BY_SLUG_QUERY = `
  *[_type == "trainer" && slug.current == $slug][0] {
    _id, name, slug, photo, specializations,
    certifications, yearsExperience, philosophy, bio,
    instagramUrl, isActive
  }
`;

export const TRAINER_SLUGS_QUERY = `
  *[_type == "trainer" && isActive == true] { "slug": slug.current }
`;

// ─── Transformations ──────────────────────────────────────────────────────────
export const ALL_TRANSFORMATIONS_QUERY = `
  *[_type == "transformation"] | order(date desc) {
    _id, clientName, beforeImage, afterImage,
    durationWeeks, weightChange, goal, testimonial,
    "trainer": trainer->{ name, slug },
    videoUrl, date, isFeatured
  }
`;

export const FEATURED_TRANSFORMATIONS_QUERY = `
  *[_type == "transformation" && isFeatured == true] | order(date desc)[0...5] {
    _id, clientName, beforeImage, afterImage,
    durationWeeks, weightChange, goal, testimonial,
    "trainer": trainer->{ name, slug }
  }
`;

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export const ALL_BLOG_POSTS_QUERY = `
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id, title, slug, featuredImage, excerpt,
    category, publishedAt, readTime,
    "author": author->{ name, slug, photo }
  }
`;

export const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id, title, slug, featuredImage, excerpt,
    category, body, publishedAt, readTime,
    seoTitle, seoDescription,
    "author": author->{ name, slug, photo },
    "relatedPosts": relatedPosts[]->{ _id, title, slug, featuredImage, category, publishedAt }
  }
`;

export const BLOG_SLUGS_QUERY = `
  *[_type == "blogPost"] { "slug": slug.current }
`;

// ─── Facilities ───────────────────────────────────────────────────────────────
export const ALL_FACILITIES_QUERY = `
  *[_type == "facility"] | order(order asc) {
    _id, name, slug, description, images, equipmentBrands, order
  }
`;

// ─── Pricing Plans ────────────────────────────────────────────────────────────
export const ALL_PRICING_PLANS_QUERY = `
  *[_type == "pricingPlan"] | order(order asc) {
    _id, name, monthlyPrice, quarterlyPrice, annualPrice,
    features, isPopular, order
  }
`;

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const FEATURED_TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && isFeatured == true] | order(date desc)[0...3] {
    _id, reviewerName, rating, excerpt, source, date
  }
`;

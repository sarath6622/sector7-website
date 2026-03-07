import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Sanity ISR revalidation webhook.
 *
 * Sanity Studio sends a POST to this endpoint whenever content changes.
 * The request must include the secret configured in SANITY_REVALIDATE_SECRET.
 *
 * Setup in Sanity: Manage → API → Webhooks → Add
 *   URL: https://your-domain.com/api/revalidate
 *   HTTP method: POST
 *   Trigger on: create, update, delete
 *   Secret: value of SANITY_REVALIDATE_SECRET
 *   Projections: _type, slug
 */

const TYPE_TO_PATHS: Record<string, string[]> = {
  trainer:        ["/trainers", "/trainers/[slug]"],
  transformation: ["/transformations"],
  blogPost:       ["/blog", "/blog/[slug]"],
  facility:       ["/facilities"],
  pricingPlan:    ["/pricing"],
  testimonial:    ["/"],
  siteSettings:   ["/"],
};

export async function POST(req: NextRequest) {
  // Validate secret
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { _type, slug } = body;

  try {
    if (_type && TYPE_TO_PATHS[_type]) {
      // Revalidate all paths for this document type
      for (const path of TYPE_TO_PATHS[_type]) {
        revalidatePath(path);
      }

      // If a slug is provided, revalidate the specific dynamic path too
      if (slug?.current) {
        if (_type === "blogPost")  revalidatePath(`/blog/${slug.current}`);
        if (_type === "trainer")   revalidatePath(`/trainers/${slug.current}`);
      }
    } else {
      // Unknown type — revalidate all pages from the root layout
      revalidatePath("/", "layout");
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slug?.current,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}

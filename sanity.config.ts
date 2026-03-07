import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name:    "sector7-studio",
  title:   "SEC7OR Fitness CMS",
  basePath: "/studio",

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton: Site Settings
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            // Collections
            S.documentTypeListItem("trainer")       .title("Trainers"),
            S.documentTypeListItem("transformation") .title("Transformations"),
            S.documentTypeListItem("blogPost")       .title("Blog Posts"),
            S.documentTypeListItem("facility")       .title("Facility Zones"),
            S.documentTypeListItem("pricingPlan")    .title("Pricing Plans"),
            S.documentTypeListItem("testimonial")    .title("Testimonials"),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});

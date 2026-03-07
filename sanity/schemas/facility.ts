import { defineField, defineType } from "sanity";
import { ThListIcon } from "@sanity/icons";

export const facility = defineType({
  name: "facility",
  title: "Facility Zone",
  type: "document",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "name",
      title: "Zone Name",
      type: "string",
      description: "E.g. Strength Zone, CrossFit Box",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short punch line for the zone",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Zone Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt text", validation: (Rule) => Rule.required() },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
    }),
    defineField({
      name: "equipmentList",
      title: "Equipment / Features",
      type: "array",
      of: [{ type: "string" }],
      description: "List shown on the facilities page",
    }),
    defineField({
      name: "equipmentBrands",
      title: "Equipment Brands",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower = displayed first",
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "images.0" },
  },
});

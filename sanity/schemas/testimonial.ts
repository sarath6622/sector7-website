import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "reviewerName",
      title: "Reviewer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "excerpt",
      title: "Review Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Google",  value: "Google"  },
          { title: "Direct",  value: "Direct"  },
        ],
        layout: "radio",
      },
      initialValue: "Google",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Show on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "date",
      title: "Review Date",
      type: "date",
    }),
  ],
  orderings: [
    {
      title: "Rating (Highest First)",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
    {
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "reviewerName", subtitle: "rating" },
    prepare({ title, subtitle }) {
      return { title, subtitle: "★".repeat(subtitle ?? 0) };
    },
  },
});

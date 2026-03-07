import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const pricingPlan = defineType({
  name: "pricingPlan",
  title: "Pricing Plan",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Plan Name",
      type: "string",
      description: "E.g. Starter, Pro, Elite",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "monthlyPrice",
      title: "Monthly Price (₹)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "quarterlyPrice",
      title: "Quarterly Price (₹)",
      type: "number",
    }),
    defineField({
      name: "annualPrice",
      title: "Annual Price (₹)",
      type: "number",
    }),
    defineField({
      name: "features",
      title: "Included Features",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "notIncluded",
      title: "Not Included (shown with ✗)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "badge",
      title: "Badge Label",
      type: "string",
      description: "E.g. 'Most Popular'. Leave empty for no badge.",
    }),
    defineField({
      name: "isHighlighted",
      title: "Highlighted (accent border)",
      type: "boolean",
      description: "Visually emphasise this plan as the recommended choice",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
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
    select: { title: "name", subtitle: "monthlyPrice" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `₹${subtitle}/month` : "" };
    },
  },
});

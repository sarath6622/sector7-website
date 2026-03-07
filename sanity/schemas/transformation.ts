import { defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";

export const transformation = defineType({
  name: "transformation",
  title: "Transformation",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name (first name only for privacy)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "beforeImage",
      title: "Before Photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "afterImage",
      title: "After Photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "durationMonths",
      title: "Duration (months)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(36),
    }),
    defineField({
      name: "weightChange",
      title: "Weight Change (kg)",
      type: "number",
      description: "Negative for weight loss (e.g. -12), positive for muscle gain",
    }),
    defineField({
      name: "changeLabel",
      title: "Change Label",
      type: "string",
      description: "Override auto-label. E.g. 'Body Recomposition' or '−18 kg'",
    }),
    defineField({
      name: "goal",
      title: "Goal Type",
      type: "string",
      options: {
        list: [
          { title: "Weight Loss",    value: "Weight Loss"    },
          { title: "Muscle Gain",    value: "Muscle Gain"    },
          { title: "Body Recomp",    value: "Body Recomp"    },
          { title: "CrossFit",       value: "CrossFit"       },
          { title: "Strength",       value: "Strength"       },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial Quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(350),
    }),
    defineField({
      name: "trainer",
      title: "Trainer",
      type: "reference",
      to: [{ type: "trainer" }],
    }),
    defineField({
      name: "date",
      title: "Transformation Date",
      type: "date",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on Homepage",
      type: "boolean",
      description: "Show in homepage TransformationPreview carousel",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "clientName",
      subtitle: "goal",
      media: "afterImage",
    },
    prepare({ title, subtitle }) {
      return { title, subtitle };
    },
  },
});

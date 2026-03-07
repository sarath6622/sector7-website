import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export const trainer = defineType({
  name: "trainer",
  title: "Trainer",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
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
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "title",
      title: "Title / Role",
      type: "string",
      description: "E.g. Head Strength & Conditioning Coach",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "specializations",
      title: "Specializations",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "experience",
      title: "Years of Experience",
      type: "number",
      validation: (Rule) => Rule.required().min(0).max(50),
    }),
    defineField({
      name: "bio",
      title: "Bio (short, for listing page)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: "fullBio",
      title: "Full Bio (for profile page)",
      type: "blockContent",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https"] }).warning("Should be a valid Instagram URL"),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 99,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Uncheck to hide from listings without deleting",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Name A–Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "title", media: "photo" },
  },
});

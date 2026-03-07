import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short description shown on listing page and in SEO meta.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Workout",   value: "Workout"   },
          { title: "Nutrition", value: "Nutrition" },
          { title: "Recovery",  value: "Recovery"  },
          { title: "Lifestyle", value: "Lifestyle" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "author",
      title: "Author (Trainer)",
      type: "reference",
      to: [{ type: "trainer" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time (minutes)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(60),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Leave blank to use post title. Max 60 characters.",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Leave blank to use excerpt. Max 160 characters.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogPost" }] }],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  orderings: [
    {
      title: "Published Date (Newest First)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "featuredImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString("en-IN") : "Unpublished",
        media,
      };
    },
  },
});

import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  // Singleton — only one document of this type should exist
  fields: [
    defineField({
      name: "gymName",
      title: "Gym Name",
      type: "string",
      initialValue: "SEC7OR FITNESS",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Displayed publicly. Format: +91 XX XXXX XXXX",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      description: "Country code + number, no + sign. E.g. 919876543210",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "googleMapsEmbedSrc",
      title: "Google Maps Embed URL",
      type: "url",
      description: "Paste the iframe src URL from Google Maps → Share → Embed",
    }),
    defineField({
      name: "googlePlaceId",
      title: "Google Place ID",
      description: "Used for fetching rating + reviews via Places API",
      type: "string",
    }),
    defineField({
      name: "operatingHours",
      title: "Operating Hours",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "day", type: "string", title: "Day(s)", description: "E.g. Monday – Saturday" },
            { name: "open", type: "string", title: "Opening Time", description: "E.g. 5:00 AM" },
            { name: "close", type: "string", title: "Closing Time", description: "E.g. 11:00 PM" },
          ],
          preview: {
            select: { title: "day", subtitle: "open" },
          },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "instagram", type: "url", title: "Instagram URL" },
        { name: "facebook", type: "url", title: "Facebook URL" },
        { name: "youtube", type: "url", title: "YouTube URL" },
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      description: "Fallback social sharing image (1200×630px recommended)",
    }),
    defineField({
      name: "timelineEvents",
      title: "About Page — Timeline",
      type: "array",
      description: "Milestones shown on the About page, displayed in order",
      of: [
        {
          type: "object",
          fields: [
            { name: "year", type: "string", title: "Year" },
            { name: "title", type: "string", title: "Milestone" },
            { name: "description", type: "text", title: "Description", rows: 3 },
          ],
          preview: { select: { title: "year", subtitle: "title" } },
        },
      ],
    }),
    defineField({
      name: "gymValues",
      title: "About Page — Core Values",
      type: "array",
      description: "Value cards shown on the About page",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Value Title" },
            { name: "description", type: "text", title: "Description", rows: 3 },
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "Pricing Page — FAQs",
      type: "array",
      description: "Frequently asked questions shown on the Pricing page",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", title: "Answer", rows: 4 },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "gymName" },
  },
});

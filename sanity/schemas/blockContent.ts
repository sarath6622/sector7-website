import { defineArrayMember, defineType } from "sanity";

/**
 * Portable Text definition shared by Trainer.bio and BlogPost.body.
 * Supports: headings, bold, italic, links, inline code, images (with caption), callout boxes.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal",     value: "normal"     },
        { title: "H2",         value: "h2"         },
        { title: "H3",         value: "h3"         },
        { title: "H4",         value: "h4"         },
        { title: "Quote",      value: "blockquote" },
      ],
      lists: [
        { title: "Bullet",   value: "bullet"   },
        { title: "Numbered", value: "number"   },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Em",     value: "em"     },
          { title: "Code",   value: "code"   },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
              {
                title: "Open in new tab",
                name: "blank",
                type: "boolean",
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    // Inline image with optional caption
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (Rule) => Rule.required().error("Alt text is required for accessibility"),
        },
      ],
    }),
    // Callout / highlight box
    defineArrayMember({
      type: "object",
      name: "callout",
      title: "Callout Box",
      fields: [
        {
          name: "tone",
          type: "string",
          options: { list: ["info", "warning", "tip"] },
          initialValue: "tip",
        },
        { name: "text", type: "text", title: "Text" },
      ],
    }),
  ],
});

import { defineType, defineField } from "sanity";
import { links, richText } from "./shared";
export default defineType({
  name: "artist",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    richText("biography"),
    defineField({ name: "image", type: "media" }),
    links(),
  ],
});

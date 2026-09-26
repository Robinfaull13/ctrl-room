import { defineType, defineField, defineArrayMember } from "sanity";
import { base, requiredString, links } from "./shared";
export default defineType({
  name: "release",
  type: "document",
  fields: [
    ...base,
    requiredString("catalogueNumber"),
    defineField({
      name: "tracks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "track",
          fields: [
            requiredString("title"),
            defineField({
              name: "durationSeconds",
              type: "number",
              validation: (r) => r.integer().positive(),
            }),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "credits", type: "text" }),
    links(),
  ],
});

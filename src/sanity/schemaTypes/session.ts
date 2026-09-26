import { defineType, defineField } from "sanity";
import { base, requiredString } from "./shared";
import { youtubeId } from "../validation";
export default defineType({
  name: "session",
  type: "document",
  fields: [
    ...base,
    requiredString("number"),
    requiredString("location"),
    defineField({
      name: "format",
      type: "string",
      options: { list: ["DJ set", "Live"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "durationSeconds",
      type: "number",
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: "youtubeId",
      type: "string",
      validation: (r) => r.custom(youtubeId),
    }),
  ],
});

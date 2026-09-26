import { defineType, defineField } from "sanity";
import { base, requiredString } from "./shared";
import { outboundUrl, timezone } from "../validation";
export default defineType({
  name: "event",
  type: "document",
  fields: [
    ...base,
    defineField({
      name: "timezone",
      type: "string",
      validation: (r) => r.required().custom(timezone),
    }),
    requiredString("venue"),
    requiredString("location"),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["upcoming", "past", "cancelled"] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ticketUrl",
      type: "string",
      validation: (r) => r.custom((v) => outboundUrl(v)),
    }),
  ],
});

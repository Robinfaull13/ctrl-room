import { defineType, defineField } from "sanity";
import { outboundUrl } from "../validation";
function link(name: string, contact: boolean) {
  return defineType({
    name,
    type: "object",
    fields: [
      defineField({
        name: "label",
        type: "string",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "url",
        type: "string",
        validation: (r) => r.required().custom((v) => outboundUrl(v, contact)),
      }),
    ],
  });
}
export default link("externalLink", false);
export const contactLink = link("contactLink", true);

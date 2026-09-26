import { defineField, defineArrayMember } from "sanity";
export const title = defineField({
  name: "title",
  type: "string",
  validation: (r) => r.required(),
});
// Sanity's default slug uniqueness is scoped to document type and field path.
export const slug = defineField({
  name: "slug",
  type: "slug",
  options: { source: "title" },
  validation: (r) => r.required(),
});
export const artists = defineField({
  name: "artists",
  type: "array",
  of: [defineArrayMember({ type: "reference", to: [{ type: "artist" }] })],
  validation: (r) => r.required().min(1),
});
export const media = defineField({
  name: "media",
  type: "array",
  of: [defineArrayMember({ type: "media" })],
});
export const base = [
  title,
  slug,
  defineField({
    name: "date",
    type: "datetime",
    validation: (r) => r.required(),
  }),
  artists,
  media,
];
export const richText = (name: string) =>
  defineField({
    name,
    type: "array",
    of: [defineArrayMember({ type: "block" })],
  });
export const links = (name = "links", type = "externalLink") =>
  defineField({ name, type: "array", of: [defineArrayMember({ type })] });
export const requiredString = (name: string) =>
  defineField({ name, type: "string", validation: (r) => r.required() });

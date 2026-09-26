import Link from "next/link";
import Form from "next/form";
import { labels } from "@/lib/navigation";
import type { Section } from "@/lib/content/types";
export default function BrowseControls({
  section,
  q,
  format,
}: {
  section: Section;
  q: string;
  format?: "DJ set" | "Live";
}) {
  return (
    <Form action={"/" + section} role="search">
      <label htmlFor="catalogue-search">Search {labels[section]}</label>
      <input
        key={q}
        id="catalogue-search"
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Artist or title"
      />
      {section === "studios" && (
        <>
          <label htmlFor="format">Format</label>
          <select
            key={format || "all"}
            id="format"
            name="format"
            defaultValue={format || ""}
          >
            <option value="">All formats</option>
            <option>DJ set</option>
            <option>Live</option>
          </select>
        </>
      )}
      <button type="submit">Search</button>
      <Link href={"/" + section}>Reset filters</Link>
    </Form>
  );
}

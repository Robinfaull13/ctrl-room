import Link from "next/link";
import type { Section, ContentItem } from "@/lib/content/types";
import { contentHref, querySuffix, labels } from "@/lib/navigation";
import BrowseControls from "./BrowseControls";
import ContentDetail from "./ContentDetail";
import RelatedWork from "./RelatedWork";
export default function CatalogueView({
  section,
  items,
  selected,
  related,
  q,
  format,
}: {
  section: Section;
  items: ContentItem[];
  selected: ContentItem | null;
  related: ContentItem[];
  q: string;
  format?: "DJ set" | "Live";
}) {
  const suffix = querySuffix({ q, format });
  return (
    <div className="catalogue">
      <aside className="screen browse" aria-label="Browse">
        <h2>Browse</h2>
        <p className="eyebrow">{labels[section]}</p>
        <BrowseControls section={section} q={q} format={format} />
        <p>{items.length} results</p>
        {!items.length && <p>No matches.</p>}
        <ul className="result-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={contentHref(item) + suffix}
                aria-current={selected?.id === item.id ? "page" : undefined}
              >
                {item.title}
              </Link>
              <small>{item.kind === "session" ? item.format : item.kind}</small>
            </li>
          ))}
        </ul>
      </aside>
      <main className="screen detail" id="main">
        {selected ? (
          <>
            <Link className="browse-back" href={"/" + section + suffix}>
              Browse {labels[section]}
            </Link>
            <ContentDetail item={selected} />
          </>
        ) : (
          <>
            <p className="eyebrow">CTRL ROOM / {labels[section]}</p>
            <h1>{labels[section]}</h1>
            <div className="artwork-placeholder" aria-hidden="true">
              ~ ~ ~
            </div>
            <p>
              {items.length
                ? "Select a transmission from Browse."
                : "Try another search or reset your filters."}
            </p>
          </>
        )}
      </main>
      <aside className="screen context" aria-label="Context">
        <h2>Context</h2>
        {selected && (
          <>
            <h3>Artists</h3>
            {selected.artists.length ? (
              selected.artists.map((a) => <p key={a.id}>{a.name}</p>)
            ) : (
              <p>Artist information unavailable.</p>
            )}
            <p>
              <time dateTime={selected.date}>{selected.date.slice(0, 10)}</time>
            </p>
          </>
        )}
        <RelatedWork items={related} />
        <Link href="/archive">Open archive</Link>
      </aside>
    </div>
  );
}

import Link from "next/link";
import type { ContentItem } from "@/lib/content/types";
import { contentHref } from "@/lib/navigation";
export default function RelatedWork({ items }: { items: ContentItem[] }) {
  return (
    <>
      <h3>Connected work</h3>
      {items.length ? (
        <ul className="result-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={contentHref(item)}>{item.title}</Link>
              <small>{item.kind}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No connected work yet.</p>
      )}
    </>
  );
}

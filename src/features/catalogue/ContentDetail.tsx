/* eslint-disable @next/next/no-img-element -- Editorial image dimensions are optional; retain natural layout without a proxy. */
import type { ContentItem } from "@/lib/content/types";
import YouTubePlayer from "./YouTubePlayer";
export default function ContentDetail({ item }: { item: ContentItem }) {
  return (
    <article>
      <p className="eyebrow">
        {item.kind === "session"
          ? item.number
          : item.kind === "release"
            ? item.catalogueNumber
            : item.kind === "archiveEntry"
              ? item.category
              : "Invitation"}
      </p>
      <h1>{item.title}</h1>
      {item.media.length ? (
        item.media.map((m, i) => (
          <img
            key={i}
            src={m.url}
            alt={m.alt}
            width={m.width}
            height={m.height}
          />
        ))
      ) : (
        <div className="artwork-placeholder">
          <span aria-hidden="true">~ ~ ~</span>
          <p>Artwork not yet available</p>
        </div>
      )}
      {item.kind === "session" && (
        <>
          <p>
            {item.format} / {item.location}
          </p>
          <YouTubePlayer key={item.id} id={item.youtubeId} title={item.title} />
        </>
      )}
      {item.kind === "event" && (
        <>
          <p>
            {new Intl.DateTimeFormat("en", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: item.timezone,
            }).format(new Date(item.date))}{" "}
            / {item.timezone}
          </p>
          <p>
            {item.venue} / {item.location}
          </p>
          <p>Status: {item.status}</p>
          {item.ticketUrl && <a href={item.ticketUrl}>Tickets</a>}
        </>
      )}
      {item.kind === "release" && (
        <>
          <ol>
            {item.tracks.map((t, i) => (
              <li key={i}>
                {t.title}
                {t.durationSeconds
                  ? " / " +
                    Math.floor(t.durationSeconds / 60) +
                    ":" +
                    String(t.durationSeconds % 60).padStart(2, "0")
                  : ""}
              </li>
            ))}
          </ol>
          <p>{item.credits}</p>
          {item.links.map((l) => (
            <a className="outbound" key={l.url} href={l.url}>
              {l.label}
            </a>
          ))}
        </>
      )}
      {item.kind === "archiveEntry" && <p className="prose">{item.body}</p>}
    </article>
  );
}

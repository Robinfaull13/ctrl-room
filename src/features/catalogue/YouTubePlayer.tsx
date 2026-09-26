"use client";
import { useState } from "react";
export default function YouTubePlayer({
  id,
  title,
}: {
  id?: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  if (!id) return <p className="placeholder">Video not yet available</p>;
  return playing ? (
    <div className="player">
      <iframe
        title={title + " video"}
        src={"https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1"}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <button onClick={() => setPlaying(false)}>Close player</button>
    </div>
  ) : (
    <button className="primary" onClick={() => setPlaying(true)}>
      Watch session
    </button>
  );
}

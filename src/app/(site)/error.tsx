"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main id="main">
      <h1>Content unavailable</h1>
      <p>We could not load this transmission. Please try again.</p>
      <button onClick={reset}>Retry</button>
    </main>
  );
}

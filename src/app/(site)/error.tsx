"use client";
export default function ErrorPage({
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <main id="main">
      <h1>Content unavailable</h1>
      <p>We could not load this transmission. Please try again.</p>
      <button onClick={retry}>Retry</button>
    </main>
  );
}

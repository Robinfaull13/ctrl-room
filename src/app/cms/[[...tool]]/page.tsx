import Studio from "./studio";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "CMS / CTRL ROOM",
  robots: { index: false, follow: false },
};
export default function CMS() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (
    !projectId ||
    !dataset ||
    !/^[a-z0-9]+$/.test(projectId) ||
    !/^[-a-z0-9_]+$/.test(dataset)
  )
    return (
      <main>
        <h1>CMS setup required</h1>
        <p>
          Configure NEXT_PUBLIC_SANITY_PROJECT_ID and
          NEXT_PUBLIC_SANITY_DATASET, then restart the application. Editor
          access is managed through Sanity.
        </p>
      </main>
    );
  return <Studio projectId={projectId} dataset={dataset} />;
}

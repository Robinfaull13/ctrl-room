// Process-local fake HTTP transport: exercise real repository/routes without CMS credentials.
const originalFetch = globalThis.fetch;
let listAttempts = 0;
globalThis.fetch = async (input, init) => {
  const url = new URL(
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url,
  );
  if (url.hostname !== "testproject.api.sanity.io")
    return originalFetch(input, init);
  const query = url.searchParams.get("query") || "";
  if (query.includes('_type=="siteSettings"'))
    return Response.json({
      result: {
        _id: "siteSettings",
        title: "Live collective",
        description: "Live editorial description",
        about: "Live about text",
        contactLinks: [],
        socialLinks: [],
      },
    });
  listAttempts++;
  if (listAttempts === 1)
    return new Response("Temporary service outage", { status: 503 });
  return Response.json({
    result: [
      {
        _id: "live-session",
        _type: "session",
        slug: "live-set",
        title: "Recovered live set",
        date: "2026-01-01",
        artists: [],
        media: [],
        number: "001",
        location: "Studio",
        format: "Live",
      },
    ],
  });
};

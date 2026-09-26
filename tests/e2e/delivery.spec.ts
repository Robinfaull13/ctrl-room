import { test, expect } from "@playwright/test";
test("server response labels sample content and playback makes no premature requests", async ({
  page,
  request,
}) => {
  const response = await request.get("/studios/jaide");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Sample content");
  expect(html).toContain("JAIDE");
  expect(html.replace(/<!--.*?-->/g, "")).toContain("Browse Studios");
  const youtube: string[] = [];
  page.on("request", (r) => {
    if (/youtube|ytimg|googlevideo/.test(r.url())) youtube.push(r.url());
  });
  await page.goto("/studios/jaide");
  await expect(
    page.getByRole("button", { name: "Watch session" }),
  ).toBeVisible();
  expect(youtube).toEqual([]);
});
test("mobile defers heavy room code until entering desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const bodies: Promise<string>[] = [];
  page.on("response", (r) => {
    if (r.request().resourceType() === "script")
      bodies.push(r.text().catch(() => ""));
  });
  await page.goto("/studios");
  await page.getByRole("searchbox").fill("JAIDE");
  expect((await Promise.all(bodies)).join("")).not.toContain(
    "THREE.WebGLRenderer",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("[data-scene-ready]")).toHaveCount(1, {
    timeout: 30000,
  });
  expect((await Promise.all(bodies)).join("")).toContain("THREE.WebGLRenderer");
});

import { test, expect } from "@playwright/test";
test("search, detail, refresh, related event and history preserve URL state", async ({
  page,
}) => {
  await page.goto("/studios?q=JAIDE");
  await page.getByRole("link", { name: "JAIDE", exact: true }).click();
  await expect(page).toHaveURL(/studios\/jaide\?q=JAIDE$/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "JAIDE", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("searchbox")).toHaveValue("JAIDE");
  await page
    .getByRole("link", { name: "CTRL ROOM Invites", exact: true })
    .click();
  await expect(page).toHaveURL(/invites\/ctrl-room-invites$/);
  await page.goBack();
  await expect(page).toHaveURL(/studios\/jaide\?q=JAIDE$/);
  await expect(page.getByRole("searchbox")).toHaveValue("JAIDE");
  await page.goForward();
  await expect(page).toHaveURL(/invites\/ctrl-room-invites$/);
});
test("empty results reset and unknown slugs return 404", async ({ page }) => {
  await page.goto("/studios?q=nomatch");
  await expect(page.getByText("No matches.")).toBeVisible();
  await page.getByRole("link", { name: "Reset filters" }).click();
  await expect(
    page.getByRole("link", { name: "JAIDE", exact: true }),
  ).toBeVisible();
  const response = await page.goto("/studios/unknown");
  expect(response?.status()).toBe(404);
});
test("video loads only on intent and missing media remains meaningful", async ({
  page,
}) => {
  await page.goto("/studios/jaide?q=JAIDE");
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByText("Artwork not yet available")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Browse Studios" }),
  ).toHaveAttribute("href", "/studios?q=JAIDE");
  await page.getByRole("button", { name: "Watch session" }).click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie/,
  );
  await page.goto("/studios/live-session");
  await expect(page.getByText("Video not yet available")).toBeVisible();
});
test("keyboard search and settings routes work", async ({ page }) => {
  await page.goto("/studios");
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("JAIDE");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/q=JAIDE/);
  await page.goto("/about");
  await expect(page.getByText(/space for sound/)).toBeVisible();
  await page.goto("/contact");
  await expect(
    page.getByText("Contact details are not yet published."),
  ).toBeVisible();
});
test("server HTML works with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/studios/jaide");
  await expect(
    page.getByRole("heading", { name: "JAIDE", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "CTRL ROOM Invites", exact: true }),
  ).toBeVisible();
  await context.close();
});

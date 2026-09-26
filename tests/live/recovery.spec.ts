import { test, expect } from "@playwright/test";
test("Retry recovers a server content outage without displaying fixtures", async ({
  page,
}) => {
  await page.goto("/studios");
  await expect(
    page.getByRole("heading", { name: "Content unavailable" }),
  ).toBeVisible();
  await expect(page.getByText("Sample content", { exact: true })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(
    page.getByRole("link", { name: "Recovered live set", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "JAIDE", exact: true }),
  ).toHaveCount(0);
});
test("published site settings supply the public metadata", async ({ page }) => {
  await page.goto("/studios");
  await expect(page).toHaveTitle("Studios / Live collective");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Live editorial description",
  );
});

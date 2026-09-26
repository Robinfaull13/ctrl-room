import { test, expect } from "@playwright/test";
test("CMS explains missing configuration", async ({ page }) => {
  await page.goto("/cms");
  await expect(
    page.getByRole("heading", { name: "CMS setup required" }),
  ).toBeVisible();
});

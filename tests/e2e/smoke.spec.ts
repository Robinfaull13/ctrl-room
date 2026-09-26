import { test, expect } from "@playwright/test";
test("home serves an accessible CTRL ROOM entry", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "CTRL ROOM", exact: true }),
  ).toBeVisible();
});

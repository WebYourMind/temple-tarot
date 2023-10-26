import { expect, test } from "@playwright/test";

test("redirect to login", async ({ page }) => {
  await page.goto("./");

  await expect(page).toHaveURL("http://localhost:3000/login");
});

// Fails on headless chromium only.
// Works on UI chromium and all other headless browsers.
// Can't for the life of me figure out why.
// Will come back to this.

import { expect, test } from "@playwright/test";

test.describe("Authentication Tests", () => {
  test("should register a new user", async ({ page }) => {
    await page.goto("http://localhost:3000/register");
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.fill('input[id="name"]', "Test User");
    await page.fill('input[id="email"]', "test@example.com");
    await page.fill('input[id="password"]', "password");
    await page.fill('input[id="confirm-password"]', "password");
    await Promise.all([page.click("text=Submit"), page.waitForURL("/")]);

    await page.waitForSelector("text=Merlin AI", { timeout: 60000 });
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("should login an existing user", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.fill('input[id="email"]', "janedoe@example.com");
    await page.fill('input[id="password"]', "password");
    await Promise.all([page.click("text=Submit"), page.waitForURL("/")]);
    await page.waitForSelector("text=Merlin AI", { timeout: 60000 });
    await expect(page).toHaveURL("http://localhost:3000/");
  });
});

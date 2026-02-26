import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Rogue and River" })).toBeVisible();
});

test("auth pages load", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();

  await page.goto("/signup");
  await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
});

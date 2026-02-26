import { expect, type Page } from "@playwright/test";

function getRequiredEnv(name: "TEST_USER_EMAIL" | "TEST_USER_PASSWORD") {
  const value = process.env[name];
  if (!value) {
    throw new Error("Set TEST_USER_EMAIL and TEST_USER_PASSWORD to run seeding.");
  }
  return value;
}

export function getTestCredentials() {
  return {
    email: getRequiredEnv("TEST_USER_EMAIL"),
    password: getRequiredEnv("TEST_USER_PASSWORD"),
  };
}

export async function loginAsTestUser(page: Page) {
  const { email, password } = getTestCredentials();

  await page.goto("/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForURL("**/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);
}

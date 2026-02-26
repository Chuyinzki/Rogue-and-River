import { expect, test, type Page } from "@playwright/test";

import { loginAsTestUser } from "./helpers/auth";
import { seedDataByHobby, type SeedEntry } from "./helpers/seed-data";

type HobbyType = keyof typeof seedDataByHobby;

async function fillAndSaveLog(page: Page, entry: SeedEntry) {
  for (const [name, value] of Object.entries(entry)) {
    const field = page.locator(`[name="${name}"]`);
    if ((await field.count()) === 0) {
      throw new Error(`Expected form field "${name}" to exist.`);
    }

    if (typeof value === "boolean") {
      if (value) {
        await field.check();
      } else {
        await field.uncheck();
      }
      continue;
    }

    await field.fill(String(value));
  }

  await page.getByRole("button", { name: "Save log" }).click();
  await expect(page.getByText("Log saved.")).toBeVisible();
}

async function seedHobby(page: Page, hobbyType: HobbyType, entries: SeedEntry[]) {
  await page.goto(`/hobby/${hobbyType}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  for (const entry of entries) {
    await fillAndSaveLog(page, entry);
  }

  const recentSection = page.locator("section", { hasText: "Recent sessions" });
  await expect(recentSection.locator("li").first()).toBeVisible();
}

test("hobby pages require auth", async ({ page }) => {
  await page.goto("/hobby/swimming");
  await expect(page).toHaveURL(/\/login/);
});

test("seed test user with deterministic hobby logs", async ({ page }) => {
  await loginAsTestUser(page);

  await seedHobby(page, "swimming", seedDataByHobby.swimming);
  await seedHobby(page, "hiking", seedDataByHobby.hiking);
  await seedHobby(page, "workout", seedDataByHobby.workout);
  await seedHobby(page, "reading", seedDataByHobby.reading);
  await seedHobby(page, "gaming", seedDataByHobby.gaming);

  await page.goto("/hobby/reading");
  await expect(page.getByText(/\|\sFinished$/).first()).toBeVisible();

  await page.goto("/dashboard");
  for (const title of ["Swimming", "Hiking", "Workouts", "Reading", "Gaming"]) {
    await expect(page.getByRole("link", { name: new RegExp(title, "i") }).first()).toBeVisible();
  }
  await expect(page.getByText(/Finished:\s*[1-9]/)).toBeVisible();
  await expect(page.getByText("No logs yet")).toHaveCount(0);
});

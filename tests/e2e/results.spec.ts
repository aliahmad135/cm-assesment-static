import { test, expect } from "@playwright/test";

test.describe("Results Page", () => {
  test("should redirect to index if no user data", async ({ page }) => {
    await page.goto("/results.html");
    await expect(page).toHaveURL(/index\.html/);
  });

  test("should display offers after setting user data", async ({ page }) => {
    // Set localStorage before navigating
    await page.addInitScript(() => {
      localStorage.setItem("cm_assessment_user_id", "test-user-id");
      localStorage.setItem("cm_assessment_user_state", "TX");
    });

    await page.goto("/results.html");

    const offersList = page.locator("#offers-list");
    await expect(offersList).toBeVisible();
  });

  test("should require at least one offer selection", async ({ page }) => {
    // Set localStorage before navigating
    await page.addInitScript(() => {
      localStorage.setItem("cm_assessment_user_id", "test-user-id");
      localStorage.setItem("cm_assessment_user_state", "TX");
    });

    await page.goto("/results.html");
    await page.waitForSelector("#offers-list");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    const errors = page.locator("#offers-errors");
    await expect(errors).toBeVisible();
    await expect(errors).toContainText("select", { ignoreCase: true });
  });
});

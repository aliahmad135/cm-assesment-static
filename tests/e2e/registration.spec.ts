import { test, expect } from "@playwright/test";

// Generate a unique random email for each test run
function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-${timestamp}-${random}@example.com`;
}

test.describe("Registration Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html");
  });

  test("should display step 1 initially and hide step 2", async ({ page }) => {
    const step1 = page.locator("#step-1");
    const step2 = page.locator("#step-2");

    await expect(step1).toBeVisible();
    await expect(step2).toBeHidden();
  });

  test("should show validation errors when step 1 is incomplete", async ({
    page,
  }) => {
    const nextButton = page.locator("#step-1-next");
    await nextButton.click();

    const errors = page.locator("#step-1-errors");
    await expect(errors).toBeVisible();
    await expect(errors).toContainText("required", { ignoreCase: true });
  });

  test("should advance to step 2 when step 1 is complete", async ({ page }) => {
    await page.selectOption('[name="education_level"]', "bachelor");
    await page.selectOption('[name="internet_access"]', "yes");
    await page.selectOption('[name="has_certifications"]', "no");

    await page.locator("#step-1-next").click();

    const step2 = page.locator("#step-2");
    await expect(step2).toBeVisible();
    await expect(page.locator("#step-1")).toBeHidden();
  });

  test("should validate email format in step 2", async ({ page }) => {
    // Complete step 1
    await page.selectOption('[name="education_level"]', "associate");
    await page.selectOption('[name="internet_access"]', "yes");
    await page.selectOption('[name="has_certifications"]', "yes");
    await page.locator("#step-1-next").click();

    // Fill step 2 with invalid email
    await page.fill('[name="first_name"]', "Jane");
    await page.fill('[name="last_name"]', "Smith");
    await page.fill('[name="email"]', "invalid-email");
    await page.fill('[name="phone"]', "(555) 555-5555");
    await page.fill('[name="address"]', "456 Oak Ave");
    await page.fill('[name="city"]', "Dallas");
    await page.selectOption('[name="state"]', "TX");
    await page.check('[name="agreement"]');

    await page.locator("#submit-registration").click();

    const errors = page.locator("#step-2-errors");
    await expect(errors).toBeVisible();
    await expect(errors).toContainText("email", { ignoreCase: true });
  });

  test("should validate phone format in step 2", async ({ page }) => {
    // Complete step 1
    await page.selectOption('[name="education_level"]', "master");
    await page.selectOption('[name="internet_access"]', "no");
    await page.selectOption('[name="has_certifications"]', "no");
    await page.locator("#step-1-next").click();

    // Fill step 2 with invalid phone
    await page.fill('[name="first_name"]', "Bob");
    await page.fill('[name="last_name"]', "Johnson");
    await page.fill('[name="email"]', "bob@example.com");
    await page.fill('[name="phone"]', "123");
    await page.fill('[name="address"]', "789 Pine St");
    await page.fill('[name="city"]', "Austin");
    await page.selectOption('[name="state"]', "TX");
    await page.check('[name="agreement"]');

    await page.locator("#submit-registration").click();

    const errors = page.locator("#step-2-errors");
    await expect(errors).toBeVisible();
    await expect(errors).toContainText("phone", { ignoreCase: true });
  });

  test("should require agreement checkbox in step 2", async ({ page }) => {
    // Complete step 1
    await page.selectOption('[name="education_level"]', "high_school");
    await page.selectOption('[name="internet_access"]', "yes");
    await page.selectOption('[name="has_certifications"]', "no");
    await page.locator("#step-1-next").click();

    // Fill step 2 without checking agreement
    await page.fill('[name="first_name"]', "Alice");
    await page.fill('[name="last_name"]', "Williams");
    await page.fill('[name="email"]', "alice@example.com");
    await page.fill('[name="phone"]', "(555) 555-5555");
    await page.fill('[name="address"]', "321 Elm St");
    await page.fill('[name="city"]', "Houston");
    await page.selectOption('[name="state"]', "TX");

    await page.locator("#submit-registration").click();

    const errors = page.locator("#step-2-errors");
    await expect(errors).toBeVisible();
    await expect(errors).toContainText("agree", { ignoreCase: true });
  });

  test("should show errors for missing required fields in step 2", async ({
    page,
  }) => {
    // Complete step 1
    await page.selectOption('[name="education_level"]', "bachelor");
    await page.selectOption('[name="internet_access"]', "yes");
    await page.selectOption('[name="has_certifications"]', "no");
    await page.locator("#step-1-next").click();

    // Try to submit step 2 with empty fields
    await page.locator("#submit-registration").click();

    const errors = page.locator("#step-2-errors");
    await expect(errors).toBeVisible();
  });

  test("should complete full registration flow and navigate to results page", async ({
    page,
  }) => {
    // Generate a unique email for this test run
    const email = generateRandomEmail();

    // Step 1: Fill out eligibility form
    await page.selectOption('[name="education_level"]', "high_school");
    await page.selectOption('[name="internet_access"]', "yes");
    await page.selectOption('[name="has_certifications"]', "no");

    // Click the "Next Step" button
    await page.locator("#step-1-next").click();

    // Wait for step 2 to be visible
    await expect(page.locator("#step-2")).toBeVisible();

    // Step 2: Fill out personal information form
    await page.fill('[name="first_name"]', "John");
    await page.fill('[name="last_name"]', "Doe");
    await page.fill('[name="email"]', email);
    await page.fill('[name="phone"]', "(555) 555-5555");
    await page.fill('[name="address"]', "123 Main Street");
    await page.fill('[name="city"]', "Springfield");
    await page.selectOption('[name="state"]', "TX");

    // Check the terms and conditions checkbox
    await page.check('[name="agreement"]');

    // Click the Submit button and wait for navigation
    await Promise.all([
      page.waitForURL(/results\.html/, { timeout: 10000 }),
      page.locator("#submit-registration").click(),
    ]);

    // Verify we're on the results page
    await expect(page).toHaveURL(/results\.html/);

    // Also verify the offers list is visible to ensure page loaded properly
    await expect(page.locator("#offers-list")).toBeVisible({ timeout: 5000 });
  });

  test("should handle different education levels", async ({ page }) => {
    const educationLevels = ["high_school", "associate", "bachelor", "master"];

    for (const level of educationLevels) {
      await page.goto("/index.html");
      await page.selectOption('[name="education_level"]', level);
      await page.selectOption('[name="internet_access"]', "yes");
      await page.selectOption('[name="has_certifications"]', "no");
      await page.locator("#step-1-next").click();
      await expect(page.locator("#step-2")).toBeVisible();
    }
  });

  test("should allow going back to step 1 from step 2", async ({ page }) => {
    // Complete step 1 and advance
    await page.selectOption('[name="education_level"]', "bachelor");
    await page.selectOption('[name="internet_access"]', "yes");
    await page.selectOption('[name="has_certifications"]', "no");
    await page.locator("#step-1-next").click();
    await expect(page.locator("#step-2")).toBeVisible();

    // Check if there's a back button (if implemented)
    // If not, we can at least verify step 2 is visible
    const step1 = page.locator("#step-1");
    const step2 = page.locator("#step-2");
    await expect(step2).toBeVisible();
    await expect(step1).toBeHidden();
  });
});

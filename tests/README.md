# Testing Guide

This project includes comprehensive tests using Jest (unit tests), Playwright (E2E tests), and Deno (Supabase function tests).

## Setup

First, install all dependencies:

```bash
npm install
```

Then install Playwright browsers (needed for E2E tests):

```bash
npx playwright install
```

## Unit Tests (Jest)

Unit tests cover validators, models, and utilities.

### Run all unit tests:

```bash
npm test
```

### Run in watch mode:

```bash
npm run test:watch
```

### Generate coverage report:

```bash
npm run test:coverage
```

### Test Files:

- `tests/unit/EmailValidator.test.ts` - Email validation tests
- `tests/unit/PhoneValidator.test.ts` - Phone validation tests
- `tests/unit/FormValidator.test.ts` - Form validation tests
- `tests/unit/Sanitizer.test.ts` - XSS prevention tests
- `tests/unit/User.test.ts` - User model tests
- `tests/unit/Offer.test.ts` - Offer model tests
- `tests/unit/Storage.test.ts` - LocalStorage utility tests

## E2E Tests (Playwright)

E2E tests verify the complete user flow through the application.

**Important:** Make sure you've installed Playwright browsers first:

```bash
npx playwright install
```

### Run E2E tests:

```bash
npm run test:e2e
```

### Run with UI mode (interactive):

```bash
npm run test:e2e:ui
```

### Test Files:

- `tests/e2e/registration.spec.ts` - Registration form flow tests
- `tests/e2e/results.spec.ts` - Offers selection page tests

### Note:

E2E tests require a local server running. The Playwright config automatically starts a server on port 8000, but you can also run one manually:

```bash
python3 -m http.server 8000
```

## Supabase Function Tests (Deno)

Tests for the Edge Functions that handle server-side validation and data submission.

### Run function tests:

```bash
deno test supabase/functions
```

Or test individual functions:

```bash
deno test supabase/functions/submit-registration/
deno test supabase/functions/submit-offers/
```

### Test Files:

- `tests/functions/submit-registration.test.ts` - Registration function tests
- `tests/functions/submit-offers.test.ts` - Offers submission function tests

### Note:

Function tests make actual HTTP requests to your deployed Supabase functions. Make sure:

1. Your functions are deployed
2. You have the `SUPABASE_ANON_KEY` environment variable set (or update the test files with your key)

## Running All Tests

To run everything:

```bash
# Unit tests
npm test

# E2E tests (in another terminal, start server first)
python3 -m http.server 8000
npm run test:e2e

# Function tests
deno test supabase/functions
```

## Writing New Tests

### Unit Test Example:

```typescript
import { EmailValidator } from "../../src/validators/EmailValidator";

describe("EmailValidator", () => {
  test("should accept valid emails", () => {
    const validator = new EmailValidator();
    const result = validator.validate("test@example.com");
    expect(result.isValid).toBe(true);
  });
});
```

### E2E Test Example:

```typescript
import { test, expect } from "@playwright/test";

test("should submit form successfully", async ({ page }) => {
  await page.goto("/index.html");
  // ... test steps
});
```

### Function Test Example:

```typescript
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

Deno.test("function should validate input", async () => {
  const response = await fetch("https://your-function-url");
  assertEquals(response.status, 200);
});
```

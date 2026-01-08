import { EmailValidator } from "../../src/validators/EmailValidator";

describe("EmailValidator", () => {
  let validator: EmailValidator;

  beforeEach(() => {
    validator = new EmailValidator();
  });

  test("should accept valid email addresses", () => {
    const validEmails = [
      "test@example.com",
      "user.name@domain.co.uk",
      "first+last@example.org",
      "test123@test-domain.com",
    ];

    validEmails.forEach((email) => {
      const result = validator.validate(email);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  test("should reject invalid email addresses", () => {
    const invalidEmails = [
      "notanemail",
      "@example.com",
      "test@",
      "test@example",
      "test @example.com",
    ];

    invalidEmails.forEach((email) => {
      const result = validator.validate(email);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  test("should require email to be provided", () => {
    const result = validator.validate("");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Email is required");
  });

  test("should trim whitespace before validation", () => {
    const result = validator.validate("  test@example.com  ");
    expect(result.isValid).toBe(true);
  });
});

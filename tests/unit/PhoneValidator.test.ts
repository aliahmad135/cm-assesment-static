import { PhoneValidator } from "../../src/validators/PhoneValidator";

describe("PhoneValidator", () => {
  let validator: PhoneValidator;

  beforeEach(() => {
    validator = new PhoneValidator();
  });

  test("should accept valid phone formats", () => {
    const validPhones = [
      "(555) 555-5555",
      "555-555-5555",
      "5555555555",
      "1-555-555-5555",
      "(555)555-5555",
    ];

    validPhones.forEach((phone) => {
      const result = validator.validate(phone);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  test("should reject phone numbers that are too short", () => {
    const result = validator.validate("12345");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Phone number must be between 10 and 15 digits"
    );
  });

  test("should reject phone numbers that are too long", () => {
    const result = validator.validate("1234567890123456");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Phone number must be between 10 and 15 digits"
    );
  });

  test("should require phone to be provided", () => {
    const result = validator.validate("");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Phone number is required");
  });

  test("should reject phone numbers with invalid characters", () => {
    const result = validator.validate("abc-def-ghij");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Phone number must contain only digits");
  });
});

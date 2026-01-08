import { FormValidator } from "../../src/validators/FormValidator";
import { UserFormData } from "../../src/models/User";

describe("FormValidator", () => {
  let validator: FormValidator;

  beforeEach(() => {
    validator = new FormValidator();
  });

  describe("validateStep1", () => {
    test("should validate all step 1 fields are present", () => {
      const validData: Partial<UserFormData> = {
        educationLevel: "bachelor",
        hasInternetAccess: "yes",
        hasCertifications: "no",
      };

      const result = validator.validateStep1(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should reject missing education level", () => {
      const data: Partial<UserFormData> = {
        hasInternetAccess: "yes",
        hasCertifications: "no",
      };

      const result = validator.validateStep1(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Level of Education is required");
    });

    test("should reject missing internet access", () => {
      const data: Partial<UserFormData> = {
        educationLevel: "bachelor",
        hasCertifications: "no",
      };

      const result = validator.validateStep1(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Internet Access selection is required");
    });

    test("should reject missing certifications", () => {
      const data: Partial<UserFormData> = {
        educationLevel: "bachelor",
        hasInternetAccess: "yes",
      };

      const result = validator.validateStep1(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Certifications selection is required");
    });
  });

  describe("validateStep2", () => {
    test("should validate all step 2 fields are present and valid", () => {
      const validData: Partial<UserFormData> = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "(555) 555-5555",
        address: "123 Main St",
        city: "Springfield",
        state: "TX",
        agreement: true,
      };

      const result = validator.validateStep2(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should reject missing required fields", () => {
      const data: Partial<UserFormData> = {
        firstName: "John",
        email: "john@example.com",
      };

      const result = validator.validateStep2(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should validate email format", () => {
      const data: Partial<UserFormData> = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        phone: "(555) 555-5555",
        address: "123 Main St",
        city: "Springfield",
        state: "TX",
        agreement: true,
      };

      const result = validator.validateStep2(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("email"))).toBe(true);
    });

    test("should validate phone format", () => {
      const data: Partial<UserFormData> = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "123",
        address: "123 Main St",
        city: "Springfield",
        state: "TX",
        agreement: true,
      };

      const result = validator.validateStep2(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("Phone"))).toBe(true);
    });

    test("should require agreement checkbox", () => {
      const data: Partial<UserFormData> = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "(555) 555-5555",
        address: "123 Main St",
        city: "Springfield",
        state: "TX",
        agreement: false,
      };

      const result = validator.validateStep2(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "You must agree to the terms and conditions"
      );
    });
  });
});

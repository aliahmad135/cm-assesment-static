import { BaseValidator, ValidationResult } from "./Validator.js";

export class PhoneValidator extends BaseValidator<string> {
  private readonly phoneRegex = /^[\d\s\-\(\)]{10,}$/;

  validate(phone: string): ValidationResult {
    this.resetErrors();

    if (!phone || phone.trim().length === 0) {
      this.addError("Phone number is required");
      return this.getResult();
    }

    // Check if phone starts with +, and ensure no + appears after the start
    const trimmedPhone = phone.trim();
    const hasPlusAtStart = trimmedPhone.startsWith("+");
    const hasPlusAfterStart = trimmedPhone.slice(1).includes("+");

    if (hasPlusAfterStart) {
      this.addError(
        "Plus sign (+) can only appear at the start of the phone number"
      );
      return this.getResult();
    }

    // Remove + from start if present, then remove formatting characters
    const phoneWithoutPlus = hasPlusAtStart
      ? trimmedPhone.slice(1)
      : trimmedPhone;
    const digitsOnly = phoneWithoutPlus.replace(/[\s\-\(\)]/g, "");

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      this.addError("Phone number must be between 10 and 15 digits");
      return this.getResult();
    }

    if (!/^\d+$/.test(digitsOnly)) {
      this.addError(
        "Phone number must contain only digits (and optional + at the start)"
      );
      return this.getResult();
    }

    return this.getResult();
  }
}

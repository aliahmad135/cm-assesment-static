import { BaseValidator, ValidationResult } from './Validator.js';

export class PhoneValidator extends BaseValidator<string> {
  private readonly phoneRegex = /^[\d\s\-\(\)]{10,}$/;

  validate(phone: string): ValidationResult {
    this.resetErrors();

    if (!phone || phone.trim().length === 0) {
      this.addError('Phone number is required');
      return this.getResult();
    }

    const digitsOnly = phone.replace(/[\s\-\(\)]/g, '');

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      this.addError('Phone number must be between 10 and 15 digits');
      return this.getResult();
    }

    if (!/^\d+$/.test(digitsOnly)) {
      this.addError('Phone number must contain only digits');
      return this.getResult();
    }

    return this.getResult();
  }
}


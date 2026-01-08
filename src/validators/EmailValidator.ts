import { BaseValidator, ValidationResult } from './Validator.js';

export class EmailValidator extends BaseValidator<string> {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(email: string): ValidationResult {
    this.resetErrors();

    if (!email || email.trim().length === 0) {
      this.addError('Email is required');
      return this.getResult();
    }

    if (!this.emailRegex.test(email.trim())) {
      this.addError('Please enter a valid email address');
    }

    return this.getResult();
  }
}


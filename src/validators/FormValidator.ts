import { UserFormData } from '../models/User.js';
import { EmailValidator } from './EmailValidator.js';
import { PhoneValidator } from './PhoneValidator.js';
import { ValidationResult } from './Validator.js';


export class FormValidator {
  private emailValidator: EmailValidator;
  private phoneValidator: PhoneValidator;

  constructor() {
    this.emailValidator = new EmailValidator();
    this.phoneValidator = new PhoneValidator();
  }

  validateStep1(data: Partial<UserFormData>): ValidationResult {
    const errors: string[] = [];

    if (!data.educationLevel || data.educationLevel.trim() === '') {
      errors.push('Level of Education is required');
    }

    if (!data.hasInternetAccess || data.hasInternetAccess.trim() === '') {
      errors.push('Internet Access selection is required');
    }

    if (!data.hasCertifications || data.hasCertifications.trim() === '') {
      errors.push('Certifications selection is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateStep2(data: Partial<UserFormData>): ValidationResult {
    const errors: string[] = [];

    if (!data.firstName || data.firstName.trim().length === 0) {
      errors.push('First Name is required');
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      errors.push('Last Name is required');
    }

    const emailResult = this.emailValidator.validate(data.email || '');
    if (!emailResult.isValid) {
      errors.push(...emailResult.errors);
    }

    const phoneResult = this.phoneValidator.validate(data.phone || '');
    if (!phoneResult.isValid) {
      errors.push(...phoneResult.errors);
    }

    if (!data.address || data.address.trim().length === 0) {
      errors.push('Address is required');
    }

    if (!data.city || data.city.trim().length === 0) {
      errors.push('City is required');
    }

    if (!data.state || data.state.trim() === '') {
      errors.push('State is required');
    }

    if (!data.agreement) {
      errors.push('You must agree to the terms and conditions');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}


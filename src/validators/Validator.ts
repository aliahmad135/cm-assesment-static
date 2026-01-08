// Interface that all validators implement
export interface IValidator<T> {
  validate(value: T): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export abstract class BaseValidator<T> implements IValidator<T> {
  protected errors: string[] = [];

  abstract validate(value: T): ValidationResult;

  protected addError(message: string): void {
    this.errors.push(message);
  }

  protected resetErrors(): void {
    this.errors = [];
  }

  protected getResult(): ValidationResult {
    const result = {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
    };
    this.resetErrors();
    return result;
  }
}


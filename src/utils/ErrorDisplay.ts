import { Sanitizer } from './Sanitizer.js';

// Shows validation errors to the user
export class ErrorDisplay {
  // Put error messages in the specified div
  static displayErrors(containerId: string, errors: string[]): void {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Error container not found: ${containerId}`);
      return;
    }

    if (errors.length === 0) {
      container.textContent = '';
      container.hidden = true;
      return;
    }

    container.hidden = false;
    const errorList = errors.map((error) => Sanitizer.sanitizeText(error)).join('<br>');
    container.innerHTML = errorList;
  }

  // Hide any errors in the container
  static clearErrors(containerId: string): void {
    this.displayErrors(containerId, []);
  }
}


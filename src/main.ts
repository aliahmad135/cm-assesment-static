import { FormController } from "./controllers/FormController.js";
import { FormValidator } from "./validators/FormValidator.js";
import { SupabaseService } from "./services/SupabaseService.js";
import { ErrorDisplay } from "./utils/ErrorDisplay.js";
import { Storage } from "./utils/Storage.js";

class RegistrationApp {
  private formController: FormController;
  private step1Section: HTMLElement | null;
  private step2Section: HTMLElement | null;
  private step1NextButton: HTMLButtonElement | null;
  private submitButton: HTMLButtonElement | null;

  constructor() {
    const validator = new FormValidator();
    const supabaseService = new SupabaseService();
    this.formController = new FormController(validator, supabaseService);

    this.step1Section = document.getElementById("step-1");
    this.step2Section = document.getElementById("step-2");
    this.step1NextButton = document.getElementById(
      "step-1-next"
    ) as HTMLButtonElement;
    this.submitButton = document.getElementById(
      "submit-registration"
    ) as HTMLButtonElement;

    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    if (this.step1NextButton) {
      this.step1NextButton.addEventListener("click", () =>
        this.handleStep1Next()
      );
    }

    const form = document.getElementById(
      "registration-form"
    ) as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    }
  }

  private async handleStep1Next(): Promise<void> {
    const formData = this.collectStep1Data();
    const result = await this.formController.validateAndAdvance(formData);

    if (result.success) {
      ErrorDisplay.clearErrors("step-1-errors");
      this.showStep2();
    } else {
      ErrorDisplay.displayErrors("step-1-errors", result.errors);
    }
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.submitButton) return;

    const formData = this.collectStep2Data();

    // Set loading state
    const originalButtonText = this.submitButton.textContent;
    this.submitButton.disabled = true;
    this.submitButton.textContent = "Submitting...";

    try {
      const result = await this.formController.validateAndSubmit(formData);

      if (result.success && result.userId) {
        ErrorDisplay.clearErrors("step-2-errors");
        Storage.saveUserId(result.userId);
        const userState =
          typeof formData.state === "string" ? formData.state : "";
        Storage.saveUserState(userState);
        // Send them to the offers page
        window.location.href = "results.html";
      } else {
        ErrorDisplay.displayErrors("step-2-errors", result.errors);
        // Restore button state on error
        this.submitButton.disabled = false;
        this.submitButton.textContent = originalButtonText || "Submit";
      }
    } catch (error) {
      // Handle unexpected errors
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      ErrorDisplay.displayErrors("step-2-errors", [message]);
      this.submitButton.disabled = false;
      this.submitButton.textContent = originalButtonText || "Submit";
    }
  }

  private collectStep1Data(): Record<string, string> {
    const form = document.getElementById(
      "registration-form"
    ) as HTMLFormElement;
    if (!form) return {};

    return {
      educationLevel:
        (form.querySelector('[name="education_level"]') as HTMLSelectElement)
          ?.value || "",
      hasInternetAccess:
        (form.querySelector('[name="internet_access"]') as HTMLSelectElement)
          ?.value || "",
      hasCertifications:
        (form.querySelector('[name="has_certifications"]') as HTMLSelectElement)
          ?.value || "",
    };
  }

  private collectStep2Data(): Record<string, string | boolean> {
    const form = document.getElementById(
      "registration-form"
    ) as HTMLFormElement;
    if (!form) return {};

    return {
      firstName:
        (form.querySelector('[name="first_name"]') as HTMLInputElement)
          ?.value || "",
      lastName:
        (form.querySelector('[name="last_name"]') as HTMLInputElement)?.value ||
        "",
      email:
        (form.querySelector('[name="email"]') as HTMLInputElement)?.value || "",
      phone:
        (form.querySelector('[name="phone"]') as HTMLInputElement)?.value || "",
      address:
        (form.querySelector('[name="address"]') as HTMLInputElement)?.value ||
        "",
      city:
        (form.querySelector('[name="city"]') as HTMLInputElement)?.value || "",
      state:
        (form.querySelector('[name="state"]') as HTMLSelectElement)?.value ||
        "",
      agreement:
        (form.querySelector('[name="agreement"]') as HTMLInputElement)
          ?.checked || false,
    };
  }

  private showStep2(): void {
    if (this.step1Section) {
      this.step1Section.hidden = true;
    }
    if (this.step2Section) {
      this.step2Section.hidden = false;
      const firstInput = this.step2Section.querySelector(
        "input"
      ) as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new RegistrationApp();
  });
} else {
  new RegistrationApp();
}

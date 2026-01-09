import { OffersController } from "./controllers/OffersController.js";
import { SupabaseService } from "./services/SupabaseService.js";
import { ErrorDisplay } from "./utils/ErrorDisplay.js";
import { Storage } from "./utils/Storage.js";
import { Sanitizer } from "./utils/Sanitizer.js";

class ResultsApp {
  private offersController: OffersController;
  private offersListContainer: HTMLElement | null;
  private submitButton: HTMLButtonElement | null;

  constructor() {
    const supabaseService = new SupabaseService();
    this.offersController = new OffersController(supabaseService);
    this.offersListContainer = document.getElementById("offers-list");
    this.submitButton = document.querySelector(
      '#offers-form button[type="submit"]'
    ) as HTMLButtonElement;

    this.initialize();
  }

  private async initialize(): Promise<void> {
    const userId = Storage.getUserId();
    const userState = Storage.getUserState();

    if (!userId || !userState) {
      window.location.href = "index.html";
      return;
    }

    this.showLoading();

    try {
      await this.offersController.loadOffersForState(userState);
      this.hideLoading();
      this.renderOffers();
      this.initializeEventListeners();
    } catch (error) {
      this.hideLoading();
      const message =
        error instanceof Error ? error.message : "Failed to load offers";
      ErrorDisplay.displayErrors("offers-errors", [message]);
    }
  }

  private showLoading(): void {
    if (!this.offersListContainer) return;
    this.offersListContainer.innerHTML = '<div class="loading-spinner"><div class="spinner"></div>Loading offers...</div>';
  }

  private hideLoading(): void {
    if (!this.offersListContainer) return;
    // Clear loading state - renderOffers will populate it
  }

  private renderOffers(): void {
    if (!this.offersListContainer) return;

    const offers = this.offersController.getOffers();

    if (offers.length === 0) {
      this.offersListContainer.innerHTML =
        "<p>No offers available at this time.</p>";
      return;
    }

    const offersHTML = offers
      .map((offer) => {
        const imageHTML = offer.imageUrl
          ? `<img src="${Sanitizer.escapeHtml(
              offer.imageUrl
            )}" alt="${Sanitizer.escapeHtml(
              offer.name
            )}" style="max-width: 100%; height: auto; margin-bottom: 0.5rem; border-radius: 4px;" />`
          : "";

        return `
          <div class="offer-card">
            <label style="display: flex; gap: 0.75rem; cursor: pointer;">
              <input type="checkbox" value="${Sanitizer.escapeHtml(
                offer.id
              )}" style="margin-top: 0.25rem;" />
              <div style="flex: 1;">
                ${imageHTML}
                <h3>${Sanitizer.escapeHtml(offer.name)}</h3>
                <p>${Sanitizer.escapeHtml(offer.description)}</p>
              </div>
            </label>
          </div>
        `;
      })
      .join("");

    this.offersListContainer.innerHTML = offersHTML;

    // Listen for checkbox changes
    const checkboxes = this.offersListContainer.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        this.offersController.toggleOfferSelection(target.value);
      });
    });
  }

  private initializeEventListeners(): void {
    const form = document.getElementById("offers-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.submitButton) return;

    const validation = this.offersController.validateSelection();
    if (!validation.isValid) {
      ErrorDisplay.displayErrors("offers-errors", [
        validation.error || "Please select at least one offer",
      ]);
      return;
    }

    ErrorDisplay.clearErrors("offers-errors");

    this.submitButton.disabled = true;
    this.submitButton.textContent = "Submitting...";

    try {
      const userId = Storage.getUserId();
      if (!userId) {
        throw new Error("User ID not found");
      }

      await this.offersController.submitOffers(userId);
      window.location.href = "thank-you.html";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit offers";
      ErrorDisplay.displayErrors("offers-errors", [message]);
      this.submitButton.disabled = false;
      this.submitButton.textContent = "Continue";
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ResultsApp();
  });
} else {
  new ResultsApp();
}

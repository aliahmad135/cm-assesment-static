import { SupabaseService } from './services/SupabaseService.js';
import { Storage } from './utils/Storage.js';
import { Sanitizer } from './utils/Sanitizer.js';
import { User } from './models/User.js';
import { Offer } from './models/Offer.js';

class ThankYouApp {
  private supabaseService: SupabaseService;
  private userSummaryContainer: HTMLElement | null;
  private selectedOffersContainer: HTMLElement | null;

  constructor() {
    this.supabaseService = new SupabaseService();
    this.userSummaryContainer = document.getElementById('user-summary');
    this.selectedOffersContainer = document.getElementById('selected-offers');

    this.initialize();
  }

  private async initialize(): Promise<void> {
    const userId = Storage.getUserId();

    if (!userId) {
      window.location.href = 'index.html';
      return;
    }

    try {
      const [user, offers] = await Promise.all([
        this.supabaseService.getUserById(userId),
        this.supabaseService.getSelectedOffers(userId),
      ]);

      if (user) {
        this.renderUserSummary(user);
      } else {
        this.userSummaryContainer!.innerHTML = '<p>User information not found.</p>';
      }

      this.renderSelectedOffers(offers);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load information';
      if (this.userSummaryContainer) {
        this.userSummaryContainer.innerHTML = `<p style="color: #d64545;">${Sanitizer.escapeHtml(message)}</p>`;
      }
    }
  }

  private renderUserSummary(user: User): void {
    if (!this.userSummaryContainer) return;

    const formatBoolean = (value: boolean): string => (value ? 'Yes' : 'No');

    const summaryHTML = `
      <p><strong>Name:</strong> ${Sanitizer.escapeHtml(user.firstName)} ${Sanitizer.escapeHtml(user.lastName)}</p>
      <p><strong>Email:</strong> ${Sanitizer.escapeHtml(user.email)}</p>
      <p><strong>Phone:</strong> ${Sanitizer.escapeHtml(user.phone)}</p>
      <p><strong>Address:</strong> ${Sanitizer.escapeHtml(user.address)}, ${Sanitizer.escapeHtml(user.city)}, ${Sanitizer.escapeHtml(user.state)}</p>
      <p><strong>Education Level:</strong> ${Sanitizer.escapeHtml(user.educationLevel)}</p>
      <p><strong>Internet Access:</strong> ${formatBoolean(user.hasInternetAccess)}</p>
      <p><strong>Certifications:</strong> ${formatBoolean(user.hasCertifications)}</p>
    `;

    this.userSummaryContainer.innerHTML = summaryHTML;
  }

  private renderSelectedOffers(offers: Offer[]): void {
    if (!this.selectedOffersContainer) return;

    if (offers.length === 0) {
      this.selectedOffersContainer.innerHTML = '<p>No offers selected.</p>';
      return;
    }

    const offersHTML = offers
      .map((offer) => {
        const imageHTML = offer.imageUrl
          ? `<img src="${Sanitizer.escapeHtml(offer.imageUrl)}" alt="${Sanitizer.escapeHtml(offer.name)}" style="max-width: 200px; height: auto; margin-bottom: 0.5rem; border-radius: 4px;" />`
          : '';

        return `
          <div class="offer-card">
            ${imageHTML}
            <h3>${Sanitizer.escapeHtml(offer.name)}</h3>
            <p>${Sanitizer.escapeHtml(offer.description)}</p>
          </div>
        `;
      })
      .join('');

    this.selectedOffersContainer.innerHTML = offersHTML;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThankYouApp();
  });
} else {
  new ThankYouApp();
}


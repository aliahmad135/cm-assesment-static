import { Offer } from '../models/Offer.js';
import { SupabaseService } from '../services/SupabaseService.js';

export class OffersController {
  private supabaseService: SupabaseService;
  private offers: Offer[] = [];
  private selectedOfferIds: Set<string> = new Set();

  constructor(supabaseService: SupabaseService) {
    this.supabaseService = supabaseService;
  }

  async loadOffersForState(state: string): Promise<void> {
    try {
      this.offers = await this.supabaseService.getOffersForState(state);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load offers';
      throw new Error(message);
    }
  }

  getOffers(): Offer[] {
    return [...this.offers];
  }

  toggleOfferSelection(offerId: string): void {
    if (this.selectedOfferIds.has(offerId)) {
      this.selectedOfferIds.delete(offerId);
    } else {
      this.selectedOfferIds.add(offerId);
    }
  }

  getSelectedOfferIds(): string[] {
    return Array.from(this.selectedOfferIds);
  }

  validateSelection(): { isValid: boolean; error?: string } {
    if (this.selectedOfferIds.size === 0) {
      return { isValid: false, error: 'Please select at least one offer' };
    }
    return { isValid: true };
  }

  async submitOffers(userId: string): Promise<void> {
    const offerIds = this.getSelectedOfferIds();
    await this.supabaseService.submitSelectedOffers(userId, offerIds);
  }
}



export class Offer {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly imageUrl: string | null,
    public readonly stateRestriction: string | null
  ) {}
  
  static fromDatabaseRecord(record: OfferRecord): Offer {
    return new Offer(
      record.id,
      record.name,
      record.description,
      record.image_url || null,
      record.state_restriction || null
    );
  }

  isAvailableForState(state: string): boolean {
    if (!this.stateRestriction) {
      return true;
    }
    return this.stateRestriction === state;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      stateRestriction: this.stateRestriction,
    };
  }
}

export interface OfferRecord {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  state_restriction: string | null;
  created_at?: string;
}


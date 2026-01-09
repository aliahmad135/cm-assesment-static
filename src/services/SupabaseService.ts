import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Offer, OfferRecord } from "../models/Offer.js";
import { User } from "../models/User.js";

export class SupabaseService {
  private client: SupabaseClient;
  private readonly supabaseUrl: string;
  private readonly supabaseAnonKey: string;

  constructor() {
    this.supabaseUrl = this.getEnvVar("VITE_SUPABASE_URL", "");
    this.supabaseAnonKey = this.getEnvVar("VITE_SUPABASE_ANON_KEY", "");

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error("Supabase URL and Anon Key must be configured");
    }

    this.client = createClient(this.supabaseUrl, this.supabaseAnonKey);
  }

  private getEnvVar(key: string, defaultValue: string): string {
    if (typeof window !== "undefined" && (window as any).__SUPABASE_CONFIG__) {
      return (window as any).__SUPABASE_CONFIG__[key] || defaultValue;
    }
    return defaultValue;
  }

  async submitRegistration(user: User): Promise<{ userId: string }> {
    const response = await fetch(
      `${this.supabaseUrl}/functions/v1/submit-registration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.supabaseAnonKey}`,
          apikey: this.supabaseAnonKey,
        },
        body: JSON.stringify(user.toJSON()),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        responseData.message ||
        responseData.error ||
        "Failed to submit registration";
      throw new Error(errorMessage);
    }

    if (!responseData.userId) {
      throw new Error("Invalid response from registration function");
    }

    return { userId: responseData.userId };
  }

  async getOffersForState(state: string): Promise<Offer[]> {
    try {
      const { data, error } = await this.client
        .from("offers")
        .select("*")
        .or(`state_restriction.is.null,state_restriction.eq.${state}`)
        .order("name");

      if (error) {
        throw new Error(error.message || "Failed to fetch offers");
      }

      return (data as OfferRecord[]).map((record) =>
        Offer.fromDatabaseRecord(record)
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to fetch offers: ${message}`);
    }
  }

  async submitSelectedOffers(
    userId: string,
    offerIds: string[]
  ): Promise<void> {
    try {
      const { error } = await this.client.functions.invoke("submit-offers", {
        body: {
          userId,
          offerIds,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to submit offers");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to submit offers: ${message}`);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.client
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(error.message || "Failed to fetch user");
      }

      if (!data) {
        return null;
      }

      return new User(
        data.id,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.address,
        data.city,
        data.state,
        data.education_level,
        data.has_internet_access,
        data.has_certifications,
        data.created_at
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to fetch user: ${message}`);
    }
  }

  async getSelectedOffers(userId: string): Promise<Offer[]> {
    try {
      const { data, error } = await this.client
        .from("user_offers")
        .select(
          `
          offer_id,
          offers (
            id,
            name,
            description,
            image_url,
            state_restriction
          )
        `
        )
        .eq("user_id", userId);

      if (error) {
        throw new Error(error.message || "Failed to fetch selected offers");
      }

      if (!data) {
        return [];
      }

      return data.map((item: any) => Offer.fromDatabaseRecord(item.offers));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to fetch selected offers: ${message}`);
    }
  }
}

// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OfferSubmissionData {
  userId: string;
  offerIds: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const submissionData: OfferSubmissionData = await req.json();

    if (!submissionData.userId?.trim()) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (
      !Array.isArray(submissionData.offerIds) ||
      submissionData.offerIds.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "At least one offer must be selected" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("id")
      .eq("id", submissionData.userId)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: offers, error: offersError } = await supabaseClient
      .from("offers")
      .select("id")
      .in("id", submissionData.offerIds);

    if (offersError) {
      return new Response(
        JSON.stringify({
          error: "Failed to verify offers",
          message: offersError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (offers.length !== submissionData.offerIds.length) {
      return new Response(
        JSON.stringify({ error: "One or more offers not found" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await supabaseClient
      .from("user_offers")
      .delete()
      .eq("user_id", submissionData.userId);

    const userOffers = submissionData.offerIds.map((offerId) => ({
      user_id: submissionData.userId,
      offer_id: offerId,
    }));

    const { error: insertError } = await supabaseClient
      .from("user_offers")
      .insert(userOffers);

    if (insertError) {
      console.error("Database error:", insertError);
      return new Response(
        JSON.stringify({
          error: "Failed to save offer selections",
          message: insertError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Offers saved successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// @ts-nocheck
// Deno Edge Function - runs in Deno runtime, not TypeScript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  education_level: string;
  has_internet_access: boolean;
  has_certifications: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const registrationData: RegistrationData = await req.json();

    const validationErrors: string[] = [];

    if (!registrationData.first_name?.trim()) {
      validationErrors.push("First name is required");
    }
    if (!registrationData.last_name?.trim()) {
      validationErrors.push("Last name is required");
    }
    if (
      !registrationData.email?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)
    ) {
      validationErrors.push("Valid email is required");
    }
    if (!registrationData.phone?.trim()) {
      validationErrors.push("Phone number is required");
    }
    if (!registrationData.address?.trim()) {
      validationErrors.push("Address is required");
    }
    if (!registrationData.city?.trim()) {
      validationErrors.push("City is required");
    }
    if (!registrationData.state?.trim()) {
      validationErrors.push("State is required");
    }
    if (!registrationData.education_level?.trim()) {
      validationErrors.push("Education level is required");
    }

    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          errors: validationErrors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data, error } = await supabaseClient
      .from("users")
      .insert({
        first_name: registrationData.first_name.trim(),
        last_name: registrationData.last_name.trim(),
        email: registrationData.email.trim().toLowerCase(),
        phone: registrationData.phone.trim(),
        address: registrationData.address.trim(),
        city: registrationData.city.trim(),
        state: registrationData.state.trim(),
        education_level: registrationData.education_level,
        has_internet_access: registrationData.has_internet_access,
        has_certifications: registrationData.has_certifications,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);

      const errorMessage = error.message || "";
      const isDuplicateEmail =
        error.code === "23505" ||
        errorMessage.includes("duplicate key value") ||
        errorMessage.includes("unique constraint") ||
        errorMessage.includes("users_email_key");

      if (isDuplicateEmail) {
        return new Response(
          JSON.stringify({
            error: "Email has already been used",
            message: "Email has already been used",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: "Failed to create user",
          message: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ userId: data.id, success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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

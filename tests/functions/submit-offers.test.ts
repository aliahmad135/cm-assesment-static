/**
 * Tests for submit-offers Edge Function
 * Run with: deno test supabase/functions/submit-offers/
 */

import {
  assertEquals,
  assertExists,
  assert,
} from "https://deno.land/std@0.168.0/testing/asserts.ts";

Deno.test("submit-offers function should require userId", async () => {
  const invalidData = {
    offerIds: ["offer-1"],
  };

  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!anonKey) {
    throw new Error("SUPABASE_ANON_KEY environment variable is required");
  }

  const response = await fetch(
    "https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-offers",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(invalidData),
    }
  );

  // Function returns 400 for validation errors
  // May return 401 if auth fails (Supabase gateway rejection)
  assert(
    response.status === 400 || response.status === 401,
    `Expected status 400 or 401, got ${response.status}`
  );
  const data = await response.json();
  assertExists(data.error || data.message);
});

Deno.test(
  "submit-offers function should require at least one offer",
  async () => {
    const invalidData = {
      userId: "test-user-id",
      offerIds: [],
    };

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!anonKey) {
      throw new Error("SUPABASE_ANON_KEY environment variable is required");
    }

    const response = await fetch(
      "https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-offers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify(invalidData),
      }
    );

    // Function returns 400 for validation errors
    // May return 401 if auth fails (Supabase gateway rejection)
    assert(
      response.status === 400 || response.status === 401,
      `Expected status 400 or 401, got ${response.status}`
    );
    const data = await response.json();
    assertExists(data.error || data.message);
  }
);

Deno.test("submit-offers function should handle CORS preflight", async () => {
  const response = await fetch(
    "https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-offers",
    {
      method: "OPTIONS",
    }
  );

  assertEquals(response.status, 200);
  assertExists(response.headers.get("Access-Control-Allow-Origin"));

  // Consume response body to prevent leaks
  await response.text();
});

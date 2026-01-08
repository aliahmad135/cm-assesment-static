/**
 * Tests for submit-offers Edge Function
 * Run with: deno test supabase/functions/submit-offers/
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.168.0/testing/asserts.ts';

Deno.test('submit-offers function should require userId', async () => {
  const invalidData = {
    offerIds: ['offer-1'],
  };

  const response = await fetch(
    'https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-offers',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY') || ''}`,
      },
      body: JSON.stringify(invalidData),
    }
  );

  assertEquals(response.status, 400);
  const data = await response.json();
  assertExists(data.error);
});

Deno.test('submit-offers function should require at least one offer', async () => {
  const invalidData = {
    userId: 'test-user-id',
    offerIds: [],
  };

  const response = await fetch(
    'https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-offers',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY') || ''}`,
      },
      body: JSON.stringify(invalidData),
    }
  );

  assertEquals(response.status, 400);
  const data = await response.json();
  assertExists(data.error);
});

Deno.test('submit-offers function should handle CORS preflight', async () => {
  const response = await fetch(
    'https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-offers',
    {
      method: 'OPTIONS',
    }
  );

  assertEquals(response.status, 200);
  assertExists(response.headers.get('Access-Control-Allow-Origin'));
});


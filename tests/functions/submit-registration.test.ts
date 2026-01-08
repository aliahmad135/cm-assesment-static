/**
 * Tests for submit-registration Edge Function
 * Run with: deno test supabase/functions/submit-registration/
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.168.0/testing/asserts.ts';

Deno.test('submit-registration function should validate required fields', async () => {
  const invalidData = {
    first_name: '',
    last_name: 'Doe',
  };

  const response = await fetch(
    'https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-registration',
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

Deno.test('submit-registration function should validate email format', async () => {
  const invalidEmailData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'invalid-email',
    phone: '(555) 555-5555',
    address: '123 Main St',
    city: 'Springfield',
    state: 'TX',
    education_level: 'bachelor',
    has_internet_access: true,
    has_certifications: false,
  };

  const response = await fetch(
    'https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-registration',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY') || ''}`,
      },
      body: JSON.stringify(invalidEmailData),
    }
  );

  assertEquals(response.status, 400);
  const data = await response.json();
  assertExists(data.errors);
});

Deno.test('submit-registration function should handle CORS preflight', async () => {
  const response = await fetch(
    'https://vpgdmsgvlrkhexxfvswq.supabase.co/functions/v1/submit-registration',
    {
      method: 'OPTIONS',
    }
  );

  assertEquals(response.status, 200);
  assertExists(response.headers.get('Access-Control-Allow-Origin'));
});

